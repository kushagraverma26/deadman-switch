const express = require('express');
var mongoose = require('mongoose');
bodyParser = require('body-parser');
var script = require('./script');

const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(fileUpload());
app.use(cors());

var authRoutes = require('./routes/auth');
var fileRoutes = require('./routes/files');
var userRoutes = require('./routes/users');
var transactionRoutes = require('./routes/transactions');
var proofRoutes = require('./routes/proofs');



app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});



app.get("/", (req, res) => {
  res.send("<h1>Deadman Home</h1>")
})


app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use("/proofs", proofRoutes);


mongoose.connect("", { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("DB connection successful")
  app.listen(port, () => console.log(` app listening on port ${port}!`))

});

module.exports = app