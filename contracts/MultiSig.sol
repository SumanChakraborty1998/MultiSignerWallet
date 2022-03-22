// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MultiSig {
    struct Transaction {
        uint256 id;
        address payable to;
        uint256 amount;
        bool isSent;
        uint256 approvals;
    }

    uint256 public transactionIndex = 0;

    address[] private owners;

    mapping(address => mapping(uint256 => bool)) approvals; //Approvals Object
    mapping(uint256 => Transaction) transactions; //Transaction Object

    /**
    const owner1="0x12";
    const owner2="0x13";

    Txn1={
        id: 1
    }
    Txn2={
        id: 2
    }

    const approvals={
        "0x12":{
            "1":true,
            "2": false
        },
        "0x13":{
            "1":true,
            "2": true
        },
    }
    **/

    constructor(address[] memory _owners) {
        // for (uint256 i = 0; i < _owners.length; i++) {
        //     owners.push(_owners[i]);
        // }
        owners = _owners;
    }

    modifier authenticate() {
        bool isAllowed = false;

        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                isAllowed = true;
                break;
            }
        }

        require(isAllowed, "You are not the Owner");
        _;
    }

    modifier checkSentOrNot(uint256 _id) {
        require(
            transactions[_id].isSent == false,
            "Transaction is already Sent"
        );
        _;
    }

    modifier checkApprovals(uint256 _id) {
        require(
            transactions[_id].approvals >= owners.length,
            "Transaction Requires Approvals"
        );
        _;
    }

    function createTransaction(address payable _to, uint256 _amount)
        external
        authenticate
    {
        require(_to != address(0), "Invalid address");
        require(_amount > 0, "Invalid amount");
        transactions[transactionIndex] = Transaction(
            transactionIndex,
            _to,
            _amount,
            false,
            0
        );
        transactionIndex++;
    }

    function sendTransaction(uint256 _id)
        external
        payable
        authenticate
        checkSentOrNot(_id)
        checkApprovals(_id)
    {
        require(msg.value == transactions[_id].amount, "Invalid amount");
        address payable to = transactions[_id].to;
        to.transfer(msg.value);
        // to.transfer(transactions[_id].amount);
        transactions[_id].isSent = true;
        return;
    }

    function signTransaction(uint256 _id) external authenticate {
        if (approvals[msg.sender][_id] == false) {
            approvals[msg.sender][_id] = true;
            transactions[_id].approvals++;
        }

        require(approvals[msg.sender][_id], "Already Signed by You...");
    }

    function assignOwner(address _newOwner) external authenticate {
        owners.push(_newOwner);
    }

    function getOwners() external view authenticate returns (address[] memory) {
        return owners;
    }
}