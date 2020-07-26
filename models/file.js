var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var file = new Schema({
    name: { type: String, required: true, unique: true },
    ipfsHash: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    extention: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }

})

module.exports = mongoose.model('Files', file)