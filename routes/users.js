const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var users = require('../models/user');
var router = express.Router()



//Get entire Profile
router.get("/myProfile", userValidate, (req, res) => {
    tokenToId(req.get("token")).then((id) => {
        req.query['_id'] = id
        users.find(req.query).then((user) => {
            res.send(user)
        }).catch((err) => {
            res.status(400).send("Bad Request")
        })
    }).catch((err) => {
        res.status(400).send("Bad Request")
    })
})


//Get specific infornamtion
router.get("/myInfo", userValidate, (req, res) => {
    tokenToId(req.get("token")).then((id) => {
        req.query['_id'] = id
        users.find(req.query, req.body).then((user) => {
            res.send(user)
        }).catch((err) => {
            res.status(400).send("Bad Request")
        })
    }).catch((err) => {
        res.status(400).send("Bad Request")
    })
})




// Store public key
router.post("/generateKeys", userValidate, (req, res) => {
    tokenToId(req.get("token")).then((id) => {
        req.query['_id'] = id
        users.findByIdAndUpdate(req.query, { $set: { publicKey: req.body.publicKey } }, { new: true }, function (err, user) {
            if (err) {
                res.status(500).send("DB error")
            }
            else {
                res.send({ "id": user._id, "firstName": user.firstName, "email": user.email, "publicKey": user.publicKey })
            }
        })


    }).catch((err) => { res.status(403).send("Token Error") })


})


// Token Validator
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
