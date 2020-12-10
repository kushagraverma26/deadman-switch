const Web3 = require('web3');
const cron = require("node-cron");
var transactions = require('./models/transaction');
const MyContract = require('./build/contracts/Data.json');

const address = "0xC5973ffB797C0C0278d7246D430edBEa439E4830";
const privateKey = "0x2f535774e31e88aa007fab139f21eac1f4739cc80b49287f00f822159615545c";
const url = "http://localhost:8545";

const Provider = require("@truffle/hdwallet-provider");

const releaseData = async(fromUser, toUser, ipfsHash, message) =>{
    const provider = new Provider(privateKey, url);
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(MyContract.abi, MyContract.networks[networkId].address);

    console.log(`old value:${await myContract.methods.getData().call()}`);
    const receipt = await myContract.methods.releaseData(fromUser, toUser, ipfsHash, message).send({from:address});

    console.log(receipt);
    console.log(`new value:${await myContract.methods.getData().call()}`);
    return receipt;
}

// releaseData().then(()=>{console.log("Ho gya")});


// const cronJob = 
cron.schedule("0 0 * * *", async function () {
    console.log("running a task every midnight");
    var allTransactions = await transactions.find({completed: false});
    console.log(allTransactions);
    for (i = 0; i < allTransactions.length; i++) {
      // if release date is less than current date then release the contract
      // console.log(allTransactions[i]['ipfsHash']);
      // console.log(typeof(allTransactions[i]['createdBy']));
      // console.log(typeof(allTransactions[i]['createdFor']));
      // console.log(typeof(allTransactions[i]['ipfsHash']));
      // console.log(typeof(allTransactions[i]['transactionMessage']));

    //   Release data if release date is less than current time
    // var receipt = await releaseData("Testing","Testing","Testing","Testing");
    console.log(new Date(allTransactions[i]['releaseDate']));
    console.log(Date(Date.now()));
    console.log(new Date(allTransactions[i]['releaseDate']) <  new Date(Date.now()));
    if (new Date(allTransactions[i]['releaseDate']) <  new Date(Date.now())){
      var receipt = await releaseData(allTransactions[i]['createdBy'].toString(),allTransactions[i]['createdFor'].toString(),allTransactions[i]['ipfsHash'].toString(),allTransactions[i]['transactionMessage'].toString());
        transactions.findByIdAndUpdate(allTransactions[i]['_id'], { $set: { transactionDetails: JSON.stringify(receipt), completed: true } }, { new: true }, function (err, transaction) {
        if (err) {
          console.log("DB error while updating the transaction document");
        }
        else {
          console.log(transaction);
        }
      })
    }    
    }
  });
//   module.exports = {
//       releaseData: releaseData,
//       cronJob: cronJob

//   }