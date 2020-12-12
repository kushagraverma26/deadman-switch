// Model to store proof of life transactions created by the user

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var proof = new Schema({

    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    months: { type: Number, required: true },
    dateIssued: { type: Date, default: Date.now },
    transactionDetails: { type: String },
    transactionMessage: { type: String, default: "Dvault Proof of life Transaction. Proof of life for the user. Issued on the given date and valid for the specified months from the issued date." }


})

module.exports = mongoose.model('Proofs', proof)