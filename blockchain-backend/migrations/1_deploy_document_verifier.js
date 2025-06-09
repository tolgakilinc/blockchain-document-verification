const DocumentVerifier = artifacts.require("DocumentVerifier");

module.exports = function (deployer) {
  deployer.deploy(DocumentVerifier, { gas: 6000000 }); // burada gas limiti veriyoruz
};