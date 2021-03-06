const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/secret');
var users = require('../models/user');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
var router = express.Router()


// Registering a new user
router.post("/registerUser", (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var secret = speakeasy.generateSecret({
    name: "Testing"
  });
  var user = new users({
    email: req.body.email,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    address: req.body.address,
    secret: secret
  })
  var qr;
  qrcode.toDataURL(secret.otpauth_url, function (err, data) {
    qr = data;
  });
  user.save((err, newUser) => {
    if (err) res.status(409).send(err)
    else {
      res.send([newUser, { 'qrimage': qr }])
    }
  })
})

// Login using OTP
router.post("/verifyOtp", (req, res) => {
  var secret;
  var id;
  var verified;
  users.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log(err)
      res.status(400).send("Bad Request")
    }
    else if (user == null) {
      res.status(404).send("No account with given credentials exists");
    }
    else {
      id = user._id;
      secret = user.secret.ascii;
      verified = speakeasy.totp.verify({
        secret: user.secret.ascii,
        encoding: "ascii",
        token: req.body.otp,
        window: 0
      })
      console.log(verified);
      if (verified == true) {
        var token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
        res.send({
          "id": user._id,
          "firstName": user.firstName,
          "valid": verified,
          "token": token
        })
      }
      else {
        res.send({
          "valid": verified
        })
      }
    }
  })
})


router.post("/validateUser", (req, res) => {
  var query = {
    email: req.body.email
  }
  users.findOneAndUpdate(query, { $set: { validated: true } }, { new: true }, function (err, user) {
    if (err) {
      res.status(500).send("DB error")
    }
    else {
      res.send(user)
    }
  })
})


router.post("/userLogin", (req, res) => {
  users.findOne({ email: req.body.email }, (err, user) => {
    if (err) res.status(500).send("There has been an error")
    else if (user == null) res.status(404).send("No account with given credentials exists")
    else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({ "validated": user.validated, "auth": true })
      }
      else res.status(403).send("Auth Error")
    }
  })

})


module.exports = router