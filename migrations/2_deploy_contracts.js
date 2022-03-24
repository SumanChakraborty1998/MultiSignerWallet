const MultiSig = artifacts.require("MultiSig");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(MultiSig, [
    "0x8a210cfc20504cae244a12eb6b6d39556e6a1e58",
    "0xbfd90fa0c7382b4a003095314ca50c69e4eb0970",
  ]);
  const multiSig = await MultiSig.deployed();
  console.log("MultiSig Deployed address:", multiSig.address);
  // console.log(await multiSig.getOwners({ from: accounts[2] }));
};
