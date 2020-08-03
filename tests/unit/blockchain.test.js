const Blockchain = require("../../blockchain/blockchain")

describe("createNewBlock", () => {
    
    let ledger = new Blockchain();

    beforeEach( () => {
        ledger.pendingTransactions.push("First transaction...")
        ledger.pendingTransactions.push("Second transaction...")
    })

    it("should create a new block", () => {
        
        const oldLength = ledger.chain.length
        
        ledger.createNewBlock("prevHash", "hash")

        
        const newLength = ledger.chain.length
        const newBlockHash = ledger.chain[1].hash
        const prevHash = ledger.chain[1].previousBlockHash
        const newBlockIndex = ledger.chain[1].index
        const newBlockTransactions = ledger.chain[1].transactions

        expect(oldLength).toBe(newLength - 1)
        expect(newBlockHash).toBe("hash")
        expect(prevHash).toBe("prevHash")
        expect(newBlockIndex).toBe(newLength)
        expect(newBlockTransactions[0]).toBe("First transaction...")
        expect(newBlockTransactions[1]).toBe("Second transaction...")
        expect(newBlockTransactions.length).toBe(2)
        expect(ledger.pendingTransactions.length).toBe(0)
    }) 
})

describe("getLastBlock", () => {

    let ledger = new Blockchain();

    beforeEach( () => {
        ledger.chain.push("First block")
        ledger.chain.push("Second block")
        ledger.chain.push("Third block")
        ledger.chain.push("Last block")
    })

    it("should return the last block of the chain", () => {
        const lastBlock = ledger.getLastBlock()
        
        expect(lastBlock).toBe("Last block")
    })
})

describe("createNewTransaction", () => {

    let ledger = new Blockchain();

    it("should return the last block of the chain", () => {
        const newTransaction = ledger.createNewTransaction("userData", "signature", "publicKey")

        expect(newTransaction.userData).toBe("userData")
        expect(newTransaction.signature).toBe("signature")
        expect(newTransaction.publicKey).toBe("publicKey")
    })
})

describe("addTransactionToPendingTransactions", () => {

    let ledger = new Blockchain();

    beforeEach( () => {
        ledger.pendingTransactions.push("First transaction...")
        ledger.pendingTransactions.push("Second transaction...")
    })

    it("should return the last block of the chain", () => {

        const oldPendingTransactionsLength = ledger.pendingTransactions.length
        
        const index = ledger.addTransactionToPendingTransactions("Third transaction...")

        const newPendingTransactionsLength = ledger.pendingTransactions.length

        expect(newPendingTransactionsLength).toBe(oldPendingTransactionsLength + 1)
        expect(index).toBe(ledger.chain.length + 1)        
    })
})

describe("hashBlock", () => {

    let ledger = new Blockchain();

    it("should create a valid hash and return it", () => {
        const hash = ledger.hashBlock("previousBlockHash", "currentBlockData")
        expect(hash).toBeTruthy()
    })
})

describe("chainIsValid", () => {

    let ledger = new Blockchain();

    afterEach(() => {
        ledger = new Blockchain()
    })

    it("should return true if the chain is valid", () => {
        const block1 = {
            index: 2,
            timestamp: Date.now(),
            transactions: ledger.pendingTransactions,
            hash: "hash1",
            previousBlockHash: "0"
        }

        const block2 = {
            index: 3,
            timestamp: Date.now(),
            transactions: ledger.pendingTransactions,
            hash: "hash2",
            previousBlockHash: "hash1"
        }

        ledger.chain.push(block1)
        ledger.chain.push(block2) 

        const res = ledger.chainIsValid(ledger.chain)
        
        expect(res).toBe(true)
    })

    it("should return false if chain's structure is not valid", () => {
        const block1 = {
            index: 2,
            timestamp: Date.now(),
            transactions: ledger.pendingTransactions,
            hash: "hash1",
            previousBlockHash: "0"
        }

        const block2 = {
            index: 3,
            timestamp: Date.now(),
            transactions: ledger.pendingTransactions,
            hash: "hash2",
            previousBlockHash: "abc"
        }

        ledger.chain.push(block1)
        ledger.chain.push(block2)

        const res = ledger.chainIsValid(ledger.chain);
        expect(res).toBe(false)
        
    })

    it("should return false if genesys block is not valid", () => {
        
        ledger.chain[0].previousBlockHash = "1"
        let res = ledger.chainIsValid(ledger.chain);
        expect(res).toBe(false)

        ledger.chain[0].hash = "1"
        res = ledger.chainIsValid(ledger.chain);
        expect(res).toBe(false)

        ledger.chain[0].transactions.push("New transaction")
        res = ledger.chainIsValid(ledger.chain);
        expect(res).toBe(false)
        
    })

})