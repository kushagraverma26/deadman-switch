const Web3 = require('web3');
const cron = require("node-cron");
var transactions = require('./models/transaction');
var users = require('./models/user');
const MyContract = require('./build/contracts/Data.json');
var blockchain = require('./config/blockchain');
const Provider = require("@truffle/hdwallet-provider");


const address = blockchain.address;
const privateKey = blockchain.privateKey;
const url = blockchain.url;


const releaseData = async (fromUser, toUser, ipfsHash, message) => {
  const provider = new Provider(privateKey, url);
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  console.log(networkId);
  const myContract = new web3.eth.Contract(MyContract.abi, MyContract.networks[networkId].address);

  console.log(`old value:${await myContract.methods.getData().call()}`);
  const receipt = await myContract.methods.releaseData(fromUser, toUser, ipfsHash, message).send({ from: address });

  console.log(receipt);
  console.log(`new value:${await myContract.methods.getData().call()}`);
  return receipt;
}



// const cronJob = 
cron.schedule("0 0 * * *", async function () {
  console.log("running a task every midnight");
  var allTransactions = await transactions.find({ completed: false });
  console.log(allTransactions);
  for (i = 0; i < allTransactions.length; i++) {
    // if release date is less than current date then release the contract

    // console.log(allTransactions[i]['ipfsHash']);
    // console.log(typeof(allTransactions[i]['createdBy']));
    // console.log(typeof(allTransactions[i]['createdFor']));
    // console.log(typeof(allTransactions[i]['ipfsHash']));
    // console.log(typeof(allTransactions[i]['transactionMessage']));

    //   Release data if release date is less than current time

    console.log(new Date(allTransactions[i]['releaseDate']) < new Date(Date.now()));

    if (new Date(allTransactions[i]['releaseDate']) < new Date(Date.now())) {
      var receipt = await releaseData(allTransactions[i]['createdBy'].toString(), allTransactions[i]['createdFor'].toString(), allTransactions[i]['ipfsHash'].toString(), allTransactions[i]['transactionMessage'].toString());
      await transactions.findByIdAndUpdate(allTransactions[i]['_id'], { $set: { transactionDetails: JSON.stringify(receipt), completed: true } }, { new: true }, async function  (err, transaction) {
        if (err) {
          console.log("DB error while updating the transaction document");
        }
        else {
          console.log(transaction);

          // Add a file to the received files for the recipient
          await users.findByIdAndUpdate(allTransactions[i]['createdFor'], { $inc: { 'receivedFiles': 1 } }, { new: true }, function (err, user) {
            if (err) {
              console.log(err);
            }
            else {
              console.log(user);
            }
          })

        }
      })
    }
  }
});
