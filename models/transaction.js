// Model to store deadman switch transactions created by the user

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transaction = new Schema({
    ipfsHash: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    // createdFor: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    createdFor: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    completed: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now },
    releaseDate: { type: Date, required: true },
    transactionDetails: { type: String, default: "" },
    transactionMessage: { type: String, default: "Dvault Deadman Transaction" }


})

module.exports = mongoose.model('Transactions', transaction)