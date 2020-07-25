var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    phone: {
        type: Number, required: true
    },
    address: {
        line1: { type: String, required: true },
        line2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: Number, required: true }

    },
    secret: { type: Object, required: true },
    validated: { type: Boolean, default: false },

    createdDate: { type: Date, default: Date.now }

})

module.exports = mongoose.model('Users', user)