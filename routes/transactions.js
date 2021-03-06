const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var transactions = require('../models/transaction');
var users = require('../models/user');


var router = express.Router()


//Get transactios for the current user API
//For React App
router.get("/myTransactions", userValidate, (req, res) => {
    // req.query['createdBy'] = req.body.userId;
    transactions.find(req.query).then((transactions) => {
        res.send(transactions)
    }).catch((err) => {
        res.status(400).send("Bad Request")
    })
})

// API to set up a dead man switch
router.post('/setTransaction', userValidate, (req, res) => {
    console.log("Setting new transactions");
    console.log(Date(Date.now))
    console.log(req.body.releaseDate);
    var transaction = new transactions({
        fileName: req.body.fileName,
        ipfsHash: req.body.ipfsHash,
        releaseDate: req.body.releaseDate,
        createdBy: req.body.userId,
        createdFor: req.body.createdFor
    });
    transaction.save((err, newTransaction) => {
        if (err) { console.log(err);
            res.status(409).send(err)}
        else {
            res.send(newTransaction)
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