const express = require('express');
const tokenToId = require("../helpers/tokenToId");
var transactions = require('../models/transaction');
var users = require('../models/user');
var proofs = require('../models/proof');
var moment = require('moment');

const Web3 = require('web3');
const MyContract = require('../build/contracts/Life.json');
var blockchain = require('../config/blockchain');
const Provider = require("@truffle/hdwallet-provider");

var router = express.Router()


const address = blockchain.address;
const privateKey = blockchain.privateKey;
const url = blockchain.url;




const releaseProof = async(userId, date, months, message) =>{
    const provider = new Provider(privateKey, url);
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(MyContract.abi, MyContract.networks[networkId].address);

    // View old value
    console.log(`old value:${await myContract.methods.getLifeProof().call()}`);
    const receipt = await myContract.methods.releaseLifeProof(userId, date, months, message).send({from:address});


    console.log(receipt);
    console.log(`new value:${await myContract.methods.getLifeProof().call()}`);
    return receipt;
}






router.post('/giveProof', userValidate,  async (req, res) => {
    console.log("Giving proof");
    // console.log(Date(Date.now));
    // console.log(Date(Date.now).toString());
    // console.log(req.body.months);
    // console.log(req.body.userId);
    var userId = req.body.userId;
    console.log(address);
    // updating the release dates of the transactions set by the user.
    var receipt = await releaseProof(userId.toString(), Date(Date.now).toString(),req.body.months.toString(),blockchain.defaultProofOfLifeMessage.toString());

    transactions.find({createdBy: userId, completed: false}).then((allTransactions) => {
        // console.log(transactions);
        for(i =0; i < allTransactions.length ; i++) {
            console.log(allTransactions[i].releaseDate);
            var oldDate = new Date(allTransactions[i].releaseDate);
            var newDate = new Date (moment(oldDate).add(req.body.months, 'months'));
            // console.log(oldDate);
            console.log(newDate)
            transactions.findByIdAndUpdate(allTransactions[i]['_id'], { $set: { releaseDate: newDate, completed: true } }, { new: true }, function (err, updatedTransaction) {
                if (err) {
                  console.log("DB error while updating the transaction document");
                }
                else {
                  console.log(updatedTransaction);
                }
              });
        } //For loop end

        var proof = new proofs({
            userId: userId,
            months: req.body.months,
            transactionDetails: JSON.stringify(receipt),
          })
    
          proof.save((err, proof) => {
            if (err) res.status(409).send(err)
            else {
              res.send( {proof})
            }
          })
    

        
    }).catch((err) => {
        res.status(400).send("Bad Request") 
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