const MultiSig = artifacts.require("MultiSig");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MultiSig, [accounts[0], accounts[1], accounts[2]]);
  const multiSig = await MultiSig.deployed();
  console.log("MultiSig Deployed address:", multiSig.address);
  // console.log(await multiSig.getOwners({ from: accounts[2] }));
};
