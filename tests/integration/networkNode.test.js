const request = require("supertest");
const config = require("config");

let server;

if (config.get("blockChainActive") == "yes") {
  describe("/networkNode", () => {
    beforeEach(() => {
      server = require("../../index");
    });

    afterEach(async () => {
      await server.close();
    });

    async function getLedger() {
      const res = await request(server).get("/blockchain");

      return res.body;
    }

    it("should return the blockchain of the current node", async () => {
      const res = await request(server).get("/blockchain");

      const ledger = res.body;

      expect(res.status).toBe(200);
      expect(ledger.chain.length).toBe(1);
      expect(ledger.chain[0].index).toBe(1);
      expect(ledger.chain[0].transactions.length).toBe(0);
      expect(ledger.chain[0].hash).toBe("0");
      expect(ledger.chain[0].previousBlockHash).toBe("0");
      expect(ledger.currentNodeUrl).toBe(
        config.get("currentNodeUrl") + config.get("port")
      );
    });

    it("should add a new transaction to the pendingTransaction array of the current node", async () => {
      let ledger = await getLedger();

      const oldPendingTransactionsLenght = ledger.pendingTransactions.length;

      const res = await request(server)
        .post("/transaction")
        .send({ newTransaction: "new transaction" });

      ledger = await getLedger();

      const newPendingTransactionsLenght = ledger.pendingTransactions.length;

      expect(res.status).toBe(200);
      expect(newPendingTransactionsLenght).toBe(
        oldPendingTransactionsLenght + 1
      );
      expect(ledger.pendingTransactions[0]).toBe("new transaction");
    });

    it("should recieve a new block and push it in the chain if block is valid", async () => {
      let ledger = await getLedger();

      const oldChainLenght = ledger.chain.length;

      const newBlock = {
        index: 2,
        timestamp: Date.now(),
        transactions: [
          {
            userData: {
              name: "Ivan",
              surname: "Giacomoni",
              id: "2",
            },
            signature: "signature",
            publicKey: "publicKey",
            transactionId: "A7SYFxd67acr6FCVf",
          },
        ],
        hash: "wfwfscffscsf",
        previousBlockHash: "0",
      };

      const res = await request(server)
        .post("/receive-new-block")
        .send({ newBlock: newBlock });

      ledger = await getLedger();

      const newChainLenght = ledger.chain.length;

      expect(res.status).toBe(200);
      expect(newChainLenght).toBe(oldChainLenght + 1);
    });

    it("should recieve a new block and reject it if block's index is not valid", async () => {
      const newBlock = {
        index: 10,
        timestamp: Date.now(),
        transactions: [
          {
            userData: {
              name: "Ivan",
              surname: "Giacomoni",
              id: "2",
            },
            signature: "signature",
            publicKey: "publicKey",
            transactionId: "A7SYFxd67acr6FCVf",
          },
        ],
        hash: "hrterwy5",
        previousBlockHash: "0",
      };

      const res = await request(server)
        .post("/receive-new-block")
        .send({ newBlock: newBlock });

      expect(res.status).toBe(400);
    });

    it("should recieve a new block and reject it if block's previous block hash is not valid", async () => {
      const newBlock = {
        index: 3,
        timestamp: Date.now(),
        transactions: [
          {
            userData: {
              name: "Ivan",
              surname: "Giacomoni",
              id: "2",
            },
            signature: "signature",
            publicKey: "publicKey",
            transactionId: "A7SYFxd67acr6FCVf",
          },
        ],
        hash: "hrterwy5",
        previousBlockHash: "invalid previous block hash",
      };

      const res = await request(server)
        .post("/receive-new-block")
        .send({ newBlock: newBlock });

      expect(res.status).toBe(400);
    });

    it("should register a new node with the network", async () => {
      let ledger = await getLedger();

      const oldNetworkNodesLength = ledger.networkNodes.length;

      res = await request(server)
        .post("/register-node")
        .send({ newNodeUrl: "http://localhost:8081" });

      ledger = await getLedger();

      const newNetworkNodesLength = ledger.networkNodes.length;

      expect(res.status).toBe(200);
      expect(newNetworkNodesLength).toBe(oldNetworkNodesLength + 1);
    });

    it("should register the current node with multiple new nodes of the network", async () => {
      let ledger = await getLedger();

      const oldNetworkNodesLength = ledger.networkNodes.length;

      const allNetworkNodes = [
        "http://localhost:8083",
        "http://localhost:8084",
        "http://localhost:8085",
      ];
      const allNetworkNodesLength = allNetworkNodes.length;

      res = await request(server)
        .post("/register-nodes-bulk")
        .send({ allNetworkNodes: allNetworkNodes });

      ledger = await getLedger();

      const newNetworkNodesLength = ledger.networkNodes.length;

      expect(res.status).toBe(200);
      expect(newNetworkNodesLength).toBe(
        oldNetworkNodesLength + allNetworkNodesLength
      );
      expect(ledger.networkNodes[2]).toBe("http://localhost:8083");
      expect(ledger.networkNodes[3]).toBe("http://localhost:8084");
      expect(ledger.networkNodes[4]).toBe("http://localhost:8085");
    });

    it("should return the transaction which contains the given pdfId if it exists", async () => {
      const pdfId = "1";

      const newTransaction = {
        userData: {
          name: "Ivan",
          surname: "Giacomoni",
          id: pdfId,
        },
        signature: "signature",
        publicKey: "publicKey",
        transactionId: "A7SYFxd67acr6FCVf",
      };

      let res = await request(server)
        .post("/transaction")
        .send({ newTransaction: newTransaction });

      const newBlock = {
        index: 3,
        timestamp: Date.now(),
        transactions: [newTransaction],
        hash: "afwgetwgwegegg",
        previousBlockHash: "wfwfscffscsf",
      };

      res = await request(server)
        .post("/receive-new-block")
        .send({ newBlock: newBlock });

      res = await request(server).get("/getTransaction/" + pdfId);

      const transaction = res.body;

      expect(res.status).toBe(200);
      expect(transaction.userData.name).toBe("Ivan");
      expect(transaction.userData.surname).toBe("Giacomoni");
      expect(transaction.userData.id).toBe("1");
      expect(transaction.signature).toBe("signature");
      expect(transaction.publicKey).toBe("publicKey");
      expect(transaction.transactionId).toBe("A7SYFxd67acr6FCVf");
    });

    it("should return 404 if no transaction with the given pdfId is found in the chain", async () => {
      const pdfId = "10";

      res = await request(server).get("/getTransaction/" + pdfId);

      expect(res.status).toBe(404);
    });
  });
} else {
  describe("IF BLOCKCHAIN IS NOT ACTIVE", () => {
    it("IT SHOULD PASS BECAUSE NO TEST", () => {
      expect(true).toBe(true);
    });
  });
}
