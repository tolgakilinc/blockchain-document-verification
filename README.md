# 📄 Blockchain Document Verification

A decentralized application (DApp) for verifying document authenticity by hashing and storing document data on the Ethereum blockchain.

## 🚀 Features

- Upload documents and calculate SHA-256 hash
- Store document hash with type info on blockchain
- Verify existence and ownership of documents
- Works with MetaMask, Ganache, Solidity, and Web3.js
- Fully functional frontend interface

## 🧱 Tech Stack

- **Solidity** (Smart Contract)
- **Web3.js** (Frontend Interaction)
- **MetaMask** (Wallet)
- **Ganache** (Local Blockchain)
- **Truffle** (Development Framework)
- **JavaScript**, **HTML**, **CSS**

## 🛠 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/tolgakilinc/blockchain-document-verification.git
cd blockchain-document-verification

# Install Truffle globally (if not installed)
npm install -g truffle

# Start Ganache locally

# Compile and deploy contracts
truffle compile
truffle migrate --reset --network development

