const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");

const config = require("config");
const port = config.get("port");
const axios = require("axios");

const ledger = new Blockchain();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get("/blockchain", (req, res) => {
  res.status(200).send(ledger);
});

router.post("/transaction", (req, res) => {
  const newTransaction = req.body.newTransaction;

  const blockIndex = ledger.addTransactionToPendingTransactions(newTransaction);

  res
    .status(200)
    .json({ note: "Transaction will be added in block " + blockIndex + "." });
});

router.post("/transaction/broadcast", (req, res) => {
  const newTransaction = ledger.createNewTransaction(
    req.body.userData,
    req.body.signature,
    req.body.publicKey
  );
  ledger.addTransactionToPendingTransactions(newTransaction);

  let requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      method: "post",
      url: networkNodeUrl + "/transaction",
      data: {
        newTransaction: newTransaction,
      },
    };

    requestPromises.push(axios(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      res
        .status(200)
        .json({ note: "Transaction created and broadcast successfully." });
    })
    .catch((err) => {
      res
        .status(400)
        .send("Something goes wrong during transaction broadcasting");
    });
});

router.get("/mine", (req, res) => {
  if (ledger.pendingTransactions.length == 0)
    return res
      .status(404)
      .send("No pending transactions found => block won't be mined!");

  const lastBlock = ledger.getLastBlock();
  const previousBlockHash = lastBlock["hash"];
  const currentBlockData = {
    transactions: ledger.pendingTransactions,
    index: lastBlock["index"] + 1,
  };

  const blockHash = ledger.hashBlock(previousBlockHash, currentBlockData);

  const newBlock = ledger.createNewBlock(previousBlockHash, blockHash);

  const requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      url: networkNodeUrl + "/receive-new-block",
      method: "post",
      data: {
        newBlock: newBlock,
      },
    };

    requestPromises.push(axios(requestOptions));
  });

  Promise.all(requestPromises)
    .then((data) => {
      res.status(200).json({
        note: "New block mined & broadcasted successfully",
        block: newBlock,
      });
    })
    .catch((err) => {
      res.status(400).send("Something goes wrong during mining broadcasting");
    });
});

router.post("/receive-new-block", (req, res) => {
  const newBlock = req.body.newBlock;

  const lastBlock = ledger.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock["index"] + 1 == newBlock["index"];

  if (correctHash && correctIndex) {
    ledger.chain.push(newBlock);
    ledger.pendingTransactions = [];
    res.status(200).json({
      note: "New block received and accepted",
      newBlock: newBlock,
    });
  } else {
    res.status(400).json({
      note: "New block rejected",
      newBlock: newBlock,
    });
  }
});

// Register a node and broadcast to the network (ON ITS OWN SERVER)
router.post("/register-and-broadcast-node", (req, res) => {
  // Register
  const newNodeUrl = req.body.newNodeUrl;
  if (ledger.networkNodes.indexOf(newNodeUrl) == -1)
    ledger.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];

  // Broadcast
  ledger.networkNodes.forEach((networkNodeUrl) => {
    // We hit '/register-node'
    const requestOptions = {
      url: networkNodeUrl + "/register-node",
      method: "post",
      data: {
        newNodeUrl: newNodeUrl,
      },
    };

    regNodesPromises.push(axios(requestOptions));
  });

  Promise.all(regNodesPromises)
    .then((data) => {
      const bulkRegisterOptions = {
        url: newNodeUrl + "/register-nodes-bulk",
        method: "post",
        data: {
          allNetworkNodes: [...ledger.networkNodes, ledger.currentNodeUrl],
        },
      };

      return axios(bulkRegisterOptions);
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully." });
    });
});

// Register a node with the network
router.post("/register-node", (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;
  const nodeNotAlreadyPresent = ledger.networkNodes.indexOf(newNodeUrl) == -1;
  const notCurrentNode = ledger.currentNodeUrl !== newNodeUrl;

  if (nodeNotAlreadyPresent && notCurrentNode)
    ledger.networkNodes.push(newNodeUrl);

  res.status(200).json({ note: "New node registered successfully." });
});

// Register multiple nodes at once  (bulk == massa)
router.post("/register-nodes-bulk", (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;

  allNetworkNodes.forEach((networkNodeUrl) => {
    const nodeNotAlreadyPresent =
      ledger.networkNodes.indexOf(networkNodeUrl) == -1;
    const notCurrentNode = ledger.currentNodeUrl !== networkNodeUrl;

    if (nodeNotAlreadyPresent && notCurrentNode)
      ledger.networkNodes.push(networkNodeUrl);
  });

  res.status(200).json({ note: "Bulk registration successfull." });
});

router.get("/consensus", (req, res) => {
  const requestPromises = [];

  ledger.networkNodes.forEach((networkNodeUrl) => {
    const requestOptions = {
      uri: networkNodeUrl + "/blockchain",
      method: "GET",
      json: true,
    };

    requestPromises.push(request(requestOptions));
  });

  Promise.all(requestPromises)
    .then((blockchains) => {
      const currentChainLenght = ledger.chain.length;
      let maxChainLength = currentChainLenght;
      let newLongestChain = null;
      let newPendingTransactions = null;

      blockchains.forEach((blockchain) => {
        if (blockchain.chain.length > maxChainLength) {
          maxChainLength = blockchain.chain.length;
          newLongestChain = blockchain.chain;
          newPendingTransactions = blockchain.pendingTransactions;
        }
      });

      if (
        !newLongestChain ||
        (newLongestChain && !ledger.chainIsValid(newLongestChain))
      ) {
        res.status(400).json({
          note: "Current chain has not been replaced.",
          chain: ledger.chain,
        });
      } else if (newLongestChain && ledger.chainIsValid(newLongestChain)) {
        ledger.chain = newLongestChain;
        ledger.pendingTransactions = newPendingTransactions;

        res.status(200).json({
          note: "This chain has been replaced.",
          chain: ledger.chain,
        });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send("Something goes wrong during consensus broadcasting");
    });
});

router.get("/getTransaction/:pdfId", (req, res) => {
  const id = req.params.pdfId;

  const chain = ledger.chain;
  const chainLength = chain.length;
  let i;

  for (i = 0; i < chainLength; i++) {
    let j;
    const transactions = chain[i].transactions;
    const transactionsLength = transactions.length;

    for (j = 0; j < transactionsLength; j++) {
      const transaction = transactions[j];

      if (transaction.userData.id == id)
        return res.status(200).send(transaction);
    }
  }

  res.status(404).send("Transaction with the given id not found");
});

module.exports = router;
