const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var users = require('../models/user');
var files = require('../models/file');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ipfsClient = require('ipfs-http-client');

const ipfs = new ipfsClient({ host: '192.168.29.132', port: '5001', protocol: 'http' });

var router = express.Router()


router.post('/upload', userValidate, (req, res) => {
    const fileName = req.body.fileName;
    const fileData = req.body.fileData;
    const fileExtention = req.body.fileExtention;
    const createdBy = req.body.userId;

    const filePath = './files/' + fileName + fileExtention;

    files.find({ "name": fileName }, (err, result) => {
        // console.log(typeof(result));
        // console.log(!result.length);
        if (err) {
            console.log("DB Error");
            return res.status(500).send(err);
        }
        else if (result.length) {
            // console.log(result);
            console.log("File already exists");
            return res.status(500).send("File already exists");

        }
        else {
            fs.writeFile('./files/' + fileName + fileExtention, fileData, async function (err) {
                if (err) {
                    console.log("Error while creating the file");
                    return res.status(500).send(err);
                }
                else {
                    console.log("helo");
                    const fileHash = await addFile(fileName, filePath);
                    console.log(fileHash.toString());
                    var file = new files({
                        name: fileName,
                        extention: fileExtention,
                        createdBy: createdBy,
                        ipfsHash: fileHash.toString()
                    })
                    file.save((err, newFile) => {
                        if (err) res.status(409).send(err)
                        else {
                            res.send(newFile)
                        }
                    })
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log("Error while removing file from server");
                            console.log(err);
                        }
                    })
                }
            });
        }
    })
})

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file });
    console.log("hii");
    console.log(fileAdded);
    const fileHash = fileAdded.cid;

    return fileHash;
}


//Token Validator
function userValidate(req, res, next) {
    tokenToId(req.get("token")).then((id) => {
        req.body.userId = id;
        users.findById(id).then((seller) => {
            if (seller) {
                next();
            }
        }).catch((err) => {
            res.status(500).send("DB Error")
        })
    }).catch((err) => { res.status(403).send("Token Error") })

}



module.exports = router