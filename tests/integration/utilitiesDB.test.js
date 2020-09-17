const request = require('supertest')
const mongoose = require("mongoose")
const config = require("config")
const { QuestionService2 } = require("../../models/questionService2");

let server

describe('Utilities DB', () => {

    describe("GET /getQuestionsITA/:service", () => {

        beforeAll(async () => {
            const url = config.get("db_test")
            await mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})
        })
    
        beforeEach(async () => {
            server = require("../../index")
        })
    
        afterEach(async () => {
            await server.close()
            await QuestionService2.deleteMany({})
        })
    
        afterAll(async () => {
            await mongoose.connection.close()
        })

        let service

        const exec = async () => {
            return await request(server).get("/getQuestionsITA/"+service)
        }

        it("should return 404 if service is not found", async () => {
            service = "not_a_service"
            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if no italian questions are found for service 2", async () => {
            service = "2"
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return all italian questions for service 2 if they exist", async () => {
            service = "2"

            const question = new QuestionService2({
                question_id: 'Q1_ITA',
                language: "ITA",
                text: "Domanda di prova",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await question.save()

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('question_id', question.question_id)
            expect(res.body[0]).toHaveProperty('text', question.text)
            expect(res.body[0]).toHaveProperty('language', question.language)
        })
        
    })

    describe("GET /getQuestionsENG/:service", () => {

        beforeAll(async () => {
            const url = config.get("db_test")
            await mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})
        })
    
        beforeEach(async () => {
            server = require("../../index")
        })
    
        afterEach(async () => {
            await server.close()
            await QuestionService2.deleteMany({})
        })
    
        afterAll(async () => {
            await mongoose.connection.close()
        })

        let service

        const exec = async () => {
            return await request(server).get("/getQuestionsENG/"+service)
        }

        it("should return 404 if service is not found", async () => {
            service = "not_a_service"
            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if no english questions are found for service 2", async () => {
            service = "2"
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return all english questions for service 2 if they exist", async () => {
            service = "2"

            const question = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "test question",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await question.save()

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('question_id', question.question_id)
            expect(res.body[0]).toHaveProperty('text', question.text)
            expect(res.body[0]).toHaveProperty('language', question.language)
        })
        
    })

    describe("GET /getQuestionsARB/:service", () => {

        beforeAll(async () => {
            const url = config.get("db_test")
            await mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true})
        })
    
        beforeEach(async () => {
            server = require("../../index")
        })
    
        afterEach(async () => {
            await server.close()
            await QuestionService2.deleteMany({})
        })
    
        afterAll(async () => {
            await mongoose.connection.close()
        })

        let service

        const exec = async () => {
            return await request(server).get("/getQuestionsARB/"+service)
        }

        it("should return 404 if service is not found", async () => {
            service = "not_a_service"
            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if no arabic questions are found for service 2", async () => {
            service = "2"
            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return all arabic questions for service 2 if they exist", async () => {
            service = "2"

            const question = new QuestionService2({
                question_id: 'Q1_ARB',
                language: "ARB",
                text: "سؤال الاختبار",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await question.save()

            const res = await exec()

            expect(res.status).toBe(200)
            expect(res.body[0]).toHaveProperty('question_id', question.question_id)
            expect(res.body[0]).toHaveProperty('text', question.text)
            expect(res.body[0]).toHaveProperty('language', question.language)
        })
        
    })

})