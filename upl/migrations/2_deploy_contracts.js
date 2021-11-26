var Meme = artifacts.require("./meme.sol");

module.exports = function(deployer) {
  deployer.deploy(Meme);
};
