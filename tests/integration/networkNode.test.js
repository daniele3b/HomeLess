const request = require('supertest')

let server


describe('/networkNode', () => {
    
    beforeEach(() => {
        server = require('../../index')
    })
        
    afterEach(async () => {
        await server.close()
    })
    
    it("should return the blockchain of the current node", async () => {
        const res = await request(server)
                .get('/blockchain')
    
        expect(res.status).toBe(200);
        expect(res.body.chain.length).toBe(1)
    })

    it("should add a new transaction to the pendingTransaction array of the current node", async () => {
        const res = await request(server)
                .post('/transaction')
                .send({newTransaction: "new transaction"})
                    
        expect(res.status).toBe(200);
    })

    it("should recieve a new block and push it in the chain if block is valid", async () => {

        const newBlock = {
            index: 2,
            timestamp: Date.now(),
            transactions: [{
                userData: {
                    name: "Ivan",
                    surname: "Giacomoni",
                    id: '2'
                },
                signature: "signature",
                publicKey: "publicKey",
                transactionId: "A7SYFxd67acr6FCVf"
            }],
            hash: "wfwfscffscsf", 
            previousBlockHash: "0",
        };

        const res = await request(server)
                .post('/receive-new-block')
                .send({newBlock: newBlock})
    
        expect(res.status).toBe(200)
    })

    it("should recieve a new block and reject it if block's index is not valid", async () => {

        const newBlock = {
            index: 3,
            timestamp: Date.now(),
            transactions: [{
                userData: {
                    name: "Ivan",
                    surname: "Giacomoni",
                    id: '2'
                },
                signature: "signature",
                publicKey: "publicKey",
                transactionId: "A7SYFxd67acr6FCVf"
            }],
            hash: "wfwfscffscsf", 
            previousBlockHash: "0",
        };

        const res = await request(server)
                .post('/receive-new-block')
                .send({newBlock: newBlock})
    
        expect(res.status).toBe(400)
    })

    it("should recieve a new block and reject it if block's previous block hash is not valid", async () => {

        const newBlock = {
            index: 2,
            timestamp: Date.now(),
            transactions: [{
                userData: {
                    name: "Ivan",
                    surname: "Giacomoni",
                    id: '2'
                },
                signature: "signature",
                publicKey: "publicKey",
                transactionId: "A7SYFxd67acr6FCVf"
            }],
            hash: "wfwfscffscsf", 
            previousBlockHash: "invalid previous block hash",
        };

        const res = await request(server)
                .post('/receive-new-block')
                .send({newBlock: newBlock})
    
        expect(res.status).toBe(400)
    })

    it("should register a new node with the network", async () => {

        const res = await request(server)
                .post('/register-node')
                .send({newNodeUrl: "http://localhost:8081"})
    
        expect(res.status).toBe(200)
    })
    
    it("should return the transaction which contains the given pdfId if it exists", async () => {
        
        const pdfId = '1'

        const newTransaction = {
            userData: {
                name: "Ivan",
                surname: "Giacomoni",
                id: pdfId
            },
            signature: "signature",
            publicKey: "publicKey",
            transactionId: "A7SYFxd67acr6FCVf"
        }

        let res = await request(server)
                .post('/transaction')
                .send({
                    newTransaction: newTransaction
                })

        const newBlock = {
            index: 3,
            timestamp: Date.now(),
            transactions: [newTransaction],
            hash: "afwgetwgwegegg", 
            previousBlockHash: "wfwfscffscsf"
        };

        res = await request(server)
                .post('/receive-new-block')
                .send({newBlock: newBlock})
        
        res = await request(server)
                .get('/getTransaction/'+pdfId)
        
    
        expect(res.status).toBe(200)
    })

    it("should return 404 if no transaction with the given pdfId is found in the chain", async () => {
        
        const pdfId = '10'

        res = await request(server)
                .get('/getTransaction/'+pdfId)
        
    
        expect(res.status).toBe(404)
    })
    
})