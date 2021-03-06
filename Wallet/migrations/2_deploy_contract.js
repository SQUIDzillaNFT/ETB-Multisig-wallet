const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Wallet = artifacts.require("Wallet");

module.exports = async function(deployer, _network, accounts) {
  await deployer.deploy(Wallet, [accounts[0], accounts[1], accounts[2]], 2);
  const wallet = await Wallet.deployed();
  // truffle always give web3 instance - send 10k wei(eth) to contract for testing
  await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: 10000});
};
