const { assert } = require("console");

const MultiSig = artifacts.require("MultiSig");
const { expectRevert } = require("@openzeppelin/test-helpers");

contract("Multi Signer Wallet Testing", async (accounts) => {
  let instance;
  let deployer = accounts[0];
  let owner1 = accounts[0];
  let owner2 = accounts[1];
  let owner3 = accounts[2];

  it("Should assign the list of owners at deployment", async () => {
    instance = await MultiSig.new([owner1, owner2, owner3], { from: deployer });
    const deployedOwners = await instance.getOwners({ from: owner1 });
    assert(
      deployedOwners[0] === owner1 &&
        deployedOwners[1] === owner2 &&
        deployedOwners[2] === owner3,
      "Sent owners and deployed owners are not equal",
    );
  });

  it("If you are not an owner, you can not create any transaction", async () => {
    try {
      await instance.createTransaction(accounts[3], 100, { from: accounts[3] });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "You are not the Owner");
    }
  });

  it("Transaction can be created succesfully", async () => {
    await instance.createTransaction(accounts[3], 100, {
      from: owner1,
    });
    assert((await instance.transactionIndex()).toNumber() === 1);
  });

  it("If you are not an owner, you can not send any transaction", async () => {
    try {
      await instance.sendTransaction(1, {
        from: accounts[4],
        value: 100,
      });
    } catch (e) {
      // console.log("Suman Here");
      console.log(e);
      assert(e.reason === "You are not the Owner");
    }
    // expectRevert(
    //   instance.sendTransaction(0, { from: accounts[4], value: 1000000 }),
    //   "You are not the Ownerrrr",
    // );
  });

  it("You can not send a transaction, if all owners are not approves the transaction", async () => {
    try {
      instance.sendTransaction(0, {
        from: owner1,
        value: 1000000,
        // gas: 80000,
      });
    } catch (e) {
      console.log(e);
      assert(e.reason === "Transaction Requires Approvals");
    }
  });

  it("Only Owners can sign the transaction", async () => {
    try {
      instance.signTransaction(0, { from: accounts[3] });
    } catch (e) {
      console.log(e);
      assert(e.reason === "You are not the Owner");
    }
  });
});
