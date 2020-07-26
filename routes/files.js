const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var users = require('../models/user');
var files = require('../models/file');
const fileUpload = require('express-fileupload');
const fs = require('fs');

var router = express.Router()


router.post('/upload', userValidate, (req, res) => {
    const fileName = req.body.fileName;
    const fileData = req.body.fileData;
    const fileExtention = req.body.fileExtention;
    const createdBy = req.body.userId;

    const filePath = './files/' + fileName;

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
            fs.writeFile('./files/' + fileName + fileExtention, fileData, function (err) {
                if (err) {
                    console.log("Error while creating the file");
                    return res.status(500).send(err);
                }
                else {
                    var file = new files({
                        name: fileName,
                        extention: fileExtention,
                        createdBy: createdBy,
                    })
                    file.save((err, newFile) => {
                        if (err) res.status(409).send(err)
                        else {
                            res.send(newFile)
                        }
                    })
                }
            });

        }
    })


})


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