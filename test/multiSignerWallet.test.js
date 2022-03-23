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
      await instance.createTransaction(accounts[3], 100, {
        from: accounts[3],
        value: 1000,
      });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "You are not the Owner");
    }
  });

  it("Sending amount should be greater than zero", async () => {
    try {
      await instance.createTransaction(accounts[9], 0, {
        from: owner1,
        value: 1000,
      });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "Invalid amount");
    }
  });

  it("Parameter amount should be less than the sent balance", async () => {
    try {
      await instance.createTransaction(accounts[9], 10, {
        from: owner1,
        value: 10,
      });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "Amount should be less");
    }
  });

  it("Transaction can be created succesfully", async () => {
    await instance.createTransaction(accounts[3], 100, {
      from: owner1,
      value: 1000,
    });
    assert((await instance.transactionIndex()).toNumber() === 1);
  });

  // it("If you are not an owner, you can not send any transaction", async () => {
  //   try {
  //     await instance.sendTransaction(0, {
  //       from: accounts[4],
  //       value: 1000000,
  //       gas: 1000000,
  //     });
  //   } catch (e) {
  //     // console.log("Suman Here");
  //     console.log(e);
  //     assert(e.reason === "You are not the Owner");
  //   }
  //   // expectRevert(
  //   //   instance.sendTransaction(0, { from: accounts[4], value: 1000000 }),
  //   //   "You are not the Ownerttttt",
  //   // );
  // });

  // it("You can not send a transaction, if all owners are not approves the transaction", async () => {
  //   try {
  //     await instance.sendTransaction(0, {
  //       from: owner1,
  //       value: 1000000,
  //       // gas: 80000,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     assert(e.reason === "Transaction Requires Approvals");
  //   }
  // });

  it("You can not sign the transaction, if you are not an owner", async () => {
    try {
      await instance.signTransaction(0, { from: accounts[3] });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "You are not the Owner");
    }
  });

  it("You can not sign the transaction, if you send invalid Transaction Id", async () => {
    try {
      await instance.signTransaction(1, { from: owner2 });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "Invalid transaction id");
    }
  });

  it("Any owner can not sign one transaction more than once", async () => {
    try {
      await instance.signTransaction(0, { from: owner2 });
      await instance.signTransaction(0, { from: owner2 });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "Already Signed by You");
    }
  });

  it("You can not assign any new owner, if you are not an owner", async () => {
    try {
      await instance.assignOwner(accounts[3], { from: accounts[3] });
    } catch (e) {
      // console.log(e);
      assert(e.reason === "You are not the Owner");
    }
  });

  it("Only Owners can assign new owner", async () => {
    await instance.assignOwner(accounts[3], { from: owner1 });
    const newOwners = await instance.getOwners({ from: owner1 });
    assert(newOwners[3] === accounts[3], "New owner is not added");
  });

  it("Only owners can see the owners List", async () => {
    const owners = await instance.getOwners({ from: owner1 });
    assert(
      owners[0] === owner1 &&
        owners[1] === owner2 &&
        owners[2] === owner3 &&
        owners[3] === accounts[3],
      "Owners are not equal",
    );
  });
});
