const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var transactions = require('../models/transaction');
var users = require('../models/user');

var router = express.Router()


router.post('/giveProof', userValidate, (req, res) => {
    console.log("Giving proof");
    console.log(Date(Date.now))
    console.log(req.body.months);
    console.log(req.body.userId);
    var userId = req.body.userId;
    transactions.find({createdBy: userId}).then((transactions) => {
        console.log(transactions);
        for(i =0; i < transactions.length ; i++) {
            console.log(transactions[i].releaseDate);
        }
    })
})



//Token Validator
function userValidate(req, res, next) {
    tokenToId(req.get("token")).then((id) => {
        console.log(id);
        req.body.userId = id;
        users.findById(id).then((user) => {
            if (user) {
                next();
            }
        }).catch((err) => {
            res.status(500).send("DB Error")
        })
    }).catch((err) => { res.status(403).send("Token Error") })

}




module.exports = router