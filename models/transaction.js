// Model to store deadman switch transactions created by the user

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transaction = new Schema({
    ipfsHash: { type: String, required: true },
    fileName: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    createdDate: { type: Date, default: Date.now },
    releaseDate: { type: Date, required: true }


})

module.exports = mongoose.model('Transactions', transaction)