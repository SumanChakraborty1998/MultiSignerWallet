# MultiSigner Wallet
(https://rajamoto-multisig-wallet.vercel.app/)

MultiSigner (multisig) wallets are smart contracts that allow multiple signers to review and agree on an action on the blockchain before the action is executed. For example, a multisig wallet could be used to control ETH, or a smart contract, requiring signatures from at least M of N total signers to execute the action. More generally, it is a type of decentralized governance.

The application is deployed to the rinkeby test network.

## Tools and Technologies
### Frontend
1. React js (https://reactjs.org/)
2. Material UI (https://mui.com/)
4. Ethers js (https://docs.ethers.io/v5/)
5. Infura (https://infura.io/)

### Backend
1. Solidity Version - above 0.8.0 (https://docs.soliditylang.org/en/v0.8.12/)
### Testing
1. Openzeppelin (https://openzeppelin.com/)
2. Truffle (https://trufflesuite.com/)
3. Ganache (https://trufflesuite.com/ganache/index.html)


## Working Procedure
1. In the landing page, user need to login with their Metamask (https://metamask.io/) wallet.
2. Keep some test ethers (rinkeby) in to that particular wallet.
3. If there are any Transactions exist, it will be displayed.
4. If you are the owner, you can approve the transaction.
5. If you are not an owner, you can only view the transactions. Not able to do any operations.


## References
2. Using Infura with Truffle (https://trufflesuite.com/guides/using-infura-custom-provider/index.html)

