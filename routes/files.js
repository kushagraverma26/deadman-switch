const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var users = require('../models/user');
var files = require('../models/file');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const ipfsClient = require('ipfs-http-client');
const CID = require('cids')

const ipfs = new ipfsClient({ host: '192.168.29.132', port: '5001', protocol: 'http' });

var router = express.Router()



//Get files for the current user API
//For React App
router.get("/myFiles", userValidate, (req, res) => {
    tokenToId(req.get("token")).then((id) => {
        req.query['createdBy'] = id
        console.log("gfd");
        files.find(req.query).then((files) => {
            console.log("gfd");
            console.log(files);


            res.send(files)
        }).catch((err) => {
            res.status(400).send("Bad Request")
        })
    }).catch((err) => {
        res.status(400).send("Bad Request")
    })
})



router.post('/upload', userValidate, (req, res) => {
    console.log("Trying to upload file");
    var fileName = req.body.fileName;
    const fileData = req.body.fileData;
    const fileExtention = req.body.fileExtention;
    const createdBy = req.body.userId;
    




    files.find({"createdBy": createdBy, "name": fileName }, (err, result) => {
        // console.log(typeof(result));
        // console.log(!result.length);
        if (err) {
            console.log("DB Error");
            return res.status(500).send(err);
        }
        else if (result.length) {
            // console.log(result);
            console.log("File already exists, Renaming File");
            fileName = updateName(fileName);
            console.log(fileName);
            // return res.status(500).send("File already exists");

        }
        const filePath = './files/' + fileName + fileExtention;
        console.log(filePath);  
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
                    if (err) {
                        console.log(err);
                        console.log("Something went wrong while adding the file info on the database");
                        res.status(409).send(err)
                    }
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


router.get("/getFile", userValidate, async (req, res) => {
    // console.log("FGDSDFVCS");
    const ci = new CID(req.query['cid']);
    const f = readFile(ci)
    try {
        f.then(async function (result) {
            console.log(result);
            try {
                for await (const item of result) {
                    console.log(item.toString('utf-8'));
                    res.send({ "fileData": item.toString('utf-8'), })
                }
            } catch (err) {
                console.log(err);
                return res.status(500).send(err);
            }
        })
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);

    }
})


const readFile = async (cid) => {
    try {
        const f = await ipfs.cat(cid);
        console.log(f);
        return f;
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);

    }
}

function updateName(name) {
    
    var ans = name+"(1)"

    return ans
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