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
