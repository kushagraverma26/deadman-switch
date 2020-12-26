const Life = artifacts.require("Life");

module.exports = function (deployer) {
  deployer.deploy(Life);
};
