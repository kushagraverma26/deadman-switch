const Web3 = require('web3');
const cron = require("node-cron");
var transactions = require('./models/transaction');

const MyContract = require('./build/contracts/Data.json');
const address = "0x2A3d9f1152f28CEb2ecCaBe101f26817c3aFe509";
const privateKey = "0x803ce0f949663b092bf263a1ad84f15dc33052ff8e17350c679a78b2bb16b8d4";
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
cron.schedule("* * * * *", async function () {
    console.log("running a task every midnight");
    var allTransactions = await transactions.find({completed: false});
    console.log(allTransactions);
    for (i = 0; i < allTransactions.length; i++) {
      console.log(allTransactions[i]['ipfsHash']);

    //   Release data if release date is less than current time
    var receipt = await releaseData("Testing","Testing","Testing","Testing");

    // var receipt = await releaseData(allTransactions[i]['createdBy'],allTransactions[i]['createdFor'],allTransactions[i]['ipfsHash'],allTransactions[i]['message']);
    // transactions.findByIdAndUpdate()

    //   subscriptions.findByIdAndUpdate(allSubscriptions[i]['_id'], { $set: { deliveredToday: false } }, { new: true }, function (err, subscription) {
    //     if (err) {
    //       console.log("DB error");
    //     }
    //     else {
    //       console.log(subscription);
    //     }
    //   })
    }
  });
//   module.exports = {
//       releaseData: releaseData,
//       cronJob: cronJob
      
//   }