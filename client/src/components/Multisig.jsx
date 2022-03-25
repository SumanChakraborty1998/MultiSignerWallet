import React, { useState } from "react";
import MultiSigner from "../contracts/MultiSig.json";
import { ethers } from "ethers";
import { NavBar } from "./NavBar";
import { Body } from "./Body";
// import Typography from "@mui/material/Typography";

export const Multisig = () => {
  const [walletAddress, setwalletAddress] = useState("");
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEntaracting, setIsEntaracting] = useState(false);
  const [transactionCount, setTransactionCount] = useState(-1);
  const [transactions, setTansactions] = useState([]);

  let provider;
  const abi = MultiSigner.abi;
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

  const handleConnectToWallet = async () => {
    setIsLoading(true);
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setTansactions([]);
      setwalletAddress(await signer.getAddress());
    } else {
      alert("Please install MetaMask");
    }
    setIsLoading(false);
    getAllData();
  };
  const handleDisconnectToWallet = async () => {
    setwalletAddress("");
  };

  const getAllData = async () => {
    if (window.ethereum) {
      setTansactions([]);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      console.log(contractInstance);
      setIsEntaracting(true);

      await contractInstance.getOwners().then((owners) => setOwners(owners));
      // await contractInstance.getApprovals(walletAddress, 0).then((res) => {
      //   console.log(res);
      // });

      // console.log(
      //   await contractInstance.getApprovals(
      //     "0x8A210cfC20504cAe244a12eb6b6D39556E6A1e58",
      //     "0",
      //   ),
      // );
      await contractInstance
        .transactionIndex()
        .then(async (tIndex) => {
          setTransactionCount(tIndex.toNumber());
          for (let i = 0; i < tIndex.toNumber(); i++) {
            await signer.getAddress().then((address) => {
              console.log(address);
              contractInstance
                .getApprovals(address, i)
                .then(async (approval) => {
                  console.log(address, i, approval);
                  await contractInstance.transactions(i).then(
                    (transaction) => {
                      console.log(transaction[0].toNumber());
                      setTansactions((prevState) => [
                        ...prevState,
                        {
                          id: transaction[0].toNumber(),
                          to: transaction[1],
                          amount: transaction[2].toNumber(),
                          isSent: transaction[3],
                          approvals: transaction[4].toNumber(),
                          yourApproval: approval,
                        },
                      ]);
                    },
                    // console.log(transaction),
                  );
                });
            });
          }
        })
        .then(() => setIsEntaracting(false));
    } else {
      alert("Please install MetaMask");
    }
  };

  const createTransaction = async (to, amt) => {
    if (window.ethereum) {
      setIsEntaracting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      await contractInstance
        .createTransaction(to, amt, {
          from: walletAddress,
          value: `${amt + 80000}`,
        })
        .then(() => {
          setTimeout(getAllData, 2000);
          setTimeout(getAllData, 6000);
        });
    }
  };

  const handleApproveTransaction = async (id) => {
    if (window.ethereum) {
      setIsEntaracting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress,
        abi,
        signer,
      );

      await contractInstance
        .signTransaction(id, {
          from: walletAddress,
        })
        .then(() => {
          setTimeout(() => {
            getAllData();
          }, 6000);
          // setTimeout(getAllData, 7000);
        });

      // setTimeout(getAllData, 8000);
    }
  };

  console.log(transactionCount);

  return (
    <div>
      <NavBar
        walletAddress={walletAddress}
        isLoading={isLoading}
        handleDisconnectToWallet={handleDisconnectToWallet}
        handleConnectToWallet={handleConnectToWallet}
        getAllData={getAllData}
      />
      {walletAddress !== "" && (
        <div style={{ margin: "auto" }}>
          <div
            style={{
              fontSize: "20px",
              width: "700px",
              margin: "auto",
              padding: "10px 1px",
              borderRadius: "10px",
              marginTop: "5px",
              background: "#9C27B0",
              fontWeight: "bold",
              fontStyle: "italic",
              color: "white",
            }}
          >
            {isLoading ? (
              <div>...Loading</div>
            ) : (
              <div>
                <span>
                  {walletAddress === owners[0]
                    ? "Owner-1"
                    : walletAddress === owners[1]
                    ? "Owner-2"
                    : "User"}
                </span>
                <br />
                <span>{walletAddress}</span>
              </div>
            )}
          </div>
        </div>
      )}
      {walletAddress === "" ? (
        <div>
          <span
            style={{
              fontSize: "40px",
              fontWeight: "bold",
            }}
          >
            Connect to MetaMask
          </span>
          <br />
          <img
            style={{ width: "300px" }}
            src="./metamask.png"
            alt="No Display"
          />
        </div>
      ) : (
        <Body
          isEntaracting={isEntaracting}
          owners={owners}
          getAllData={getAllData}
          createTransaction={createTransaction}
          transactions={transactions}
          isAOwner={owners.includes(walletAddress)}
          handleApproveTransaction={handleApproveTransaction}
        />
      )}
    </div>
  );
};
