import React, { useState } from "react";
import MultiSigner from "../contracts/MultiSig.json";
import { ethers } from "ethers";
import { NavBar } from "./NavBar";
import { Body } from "./Body";
import Typography from "@mui/material/Typography";

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

      await contractInstance.transactionIndex().then(async (tIndex) => {
        setTransactionCount(tIndex.toNumber());
        for (let i = 0; i < 2; i++) {
          await contractInstance
            .transactions(i)
            .then((transaction) =>
              setTansactions([...transactions, transaction]),
            );
        }
      });
    } else {
      alert("Please install MetaMask");
    }
  };

  return (
    <div>
      <NavBar
        walletAddress={walletAddress}
        isLoading={isLoading}
        handleDisconnectToWallet={handleDisconnectToWallet}
        handleConnectToWallet={handleConnectToWallet}
      />
      <div style={{ margin: "auto" }}>
        <Typography sx={{ fontSize: "20px" }}>
          {isLoading ? <div>...Loading</div> : walletAddress}
        </Typography>
      </div>
      {walletAddress === "" ? (
        <div div> Connect MetaMask</div>
      ) : (
        <Body isEntaracting={isEntaracting} owners={owners} />
      )}
    </div>
  );
};
