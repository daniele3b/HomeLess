const config = require("config");
const sha256 = require("sha256");
const currentNodeUrl = config.get("currentNodeUrl") + config.get("port");
const { v1: uuidv1 } = require("uuid");

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [config.get('homel_2')];

  this.createNewBlock("0", "0"); // Genesis Block
}

Blockchain.prototype.createNewBlock = function (previousBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    hash: hash, // Hash of transactions
    previousBlockHash: previousBlockHash,
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
  userData,
  signature,
  publicKey
) {
  const newTransaction = {
    userData: userData,
    signature: signature,
    publicKey: publicKey,
    transactionId: uuidv1().split("-").join(""), // Creates a unique random string that we use as the transactionId
  };

  return newTransaction;
};

Blockchain.prototype.addTransactionToPendingTransactions = function (
  transactionObj
) {
  this.pendingTransactions.push(transactionObj);
  return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.hashBlock = function (
  previousBlockHash,
  currentBlockData
) {
  const dataAsString = previousBlockHash + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
};

Blockchain.prototype.chainIsValid = function (blockchain) {
  let validChain = true;

  for (let i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];
    const blockHash = this.hashBlock(prevBlock["hash"], {
      transactions: currentBlock["transactions"],
      index: currentBlock["index"],
    });

    if (currentBlock["previousBlockHash"] !== prevBlock["hash"])
      validChain = false;
  }

  // Check for the Genesys block
  const genesisBlock = blockchain[0];

  const correctPreviousBlockHash = genesisBlock["previousBlockHash"] === "0";
  const correctHash = genesisBlock["hash"] === "0";
  const correctTransactions = genesisBlock["transactions"].length === 0;

  if (!correctPreviousBlockHash || !correctHash || !correctTransactions)
    validChain = false;

  return validChain;
};

module.exports = Blockchain;
