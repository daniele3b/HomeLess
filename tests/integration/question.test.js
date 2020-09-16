const request = require('supertest')
const mongoose = require("mongoose")
const config = require("config")
const { QuestionService2 } = require("../../models/questionService2");

let server

describe('Question', () => {

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

    describe("/getQuestion/:question_id/:service/:language", () => {

        let service
        let language
        let question_id

        const exec = async () => {
            return await request(server).get("/getQuestion/"+question_id+"/"+service+"/"+language)
        }

        it("should return 400 if question_id is less than 6 characters", async () => {
            question_id = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if question_id is more than 7 characters", async () => {
            question_id = "Q1_ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is less than 3 characthers", async () => {
            language = "IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is more than 3 characthers", async () => {
            language = "ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
            service = "not_a_service"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if question for service 2 with the given id is not found in DB", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return the given question for service 2 if it exists", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
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
            expect(res.body).toHaveProperty('question_id', question.question_id)
            expect(res.body).toHaveProperty('text', question.text)
            expect(res.body).toHaveProperty('language', question.language)
        })
        
    })

    describe("/getTreeFrom/:question_id/:service/:language", () => {

        let service
        let language
        let question_id

        const exec = async () => {
            return await request(server).get("/getTreeFrom/"+question_id+"/"+service+"/"+language)
        }

        it("should return 400 if question_id is less than 6 characters", async () => {
            question_id = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if question_id is more than 7 characters", async () => {
            question_id = "Q1_ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is less than 3 characthers", async () => {
            language = "IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is more than 3 characthers", async () => {
            language = "ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
            service = "not_a_service"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if question for service 2 with the given id is not found in DB", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return the subtree starting from a question with the given question_id for service 2 if it exists", async () => {

            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}, 
                    {nextQuestionId: "Q3_ENG", answer: "Go to Q3"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [{nextQuestionId: "Q4_ENG", answer: "Go to Q4"}, 
                    {nextQuestionId: "Q5_ENG", answer: "Go to Q5"}],
                pathPreviewPdf: "",
                template_id: null
            })

            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })

            await q3.save()

            let q4 = new QuestionService2({
                question_id: 'Q4_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_4.jpg",
                template_id: "T4"
            })

            await q4.save()

            let q5 = new QuestionService2({
                question_id: 'Q5_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_5.jpg",
                template_id: "T5"
            })

            await q5.save()


            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            let res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(5)
            expect(res.body).toContain(q1.question_id);
            expect(res.body).toContain(q2.question_id);
            expect(res.body).toContain(q3.question_id);
            expect(res.body).toContain(q4.question_id);
            expect(res.body).toContain(q5.question_id);

            
            question_id = "Q2_ENG"
            res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body).not.toContain(q1.question_id);
            expect(res.body).toContain(q2.question_id);
            expect(res.body).not.toContain(q3.question_id);
            expect(res.body).toContain(q4.question_id);
            expect(res.body).toContain(q5.question_id);
        })
        
    })

    describe("/getPath/from/:questionStartId/to/:questionEndId/:service/:language", () => {

        let service
        let language
        let questionStartId
        let questionEndId

        const exec = async () => {
            return await request(server)
                .get("/getPath/from/"+questionStartId+"/to/"+questionEndId+"/"+service+"/"+language)
        }

        it("should return 400 if questionStartId is less than 6 characters", async () => {
            questionStartId = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if questionStartId is more than 7 characters", async () => {
            questionStartId = "Q1_ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if questionEndId is less than 6 characters", async () => {
            questionEndId = "Q5_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if questionEndId is more than 7 characters", async () => {
            questionEndId = "Q5_ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is less than 3 characthers", async () => {
            language = "IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is more than 3 characthers", async () => {
            language = "ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            questionStartId = "Q1_ENG"
            questionEndId = "Q5_ENG"
            language = "ENG"
            service = "not_a_service"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if questionStart for service 2 with the given id is not found in DB", async () => {
            questionStartId = "Q1_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return 404 if questionEnd for service 2 with the given id is not found in DB", async () => {
            questionEnd = "Q5_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(404)
        })

        it("should return the subtree starting from a question with the given questionStartId and ending to a question with the given QuestionEndId for service 2 if it exists", async () => {

            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}, 
                    {nextQuestionId: "Q3_ENG", answer: "Go to Q3"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [{nextQuestionId: "Q4_ENG", answer: "Go to Q4"}, 
                    {nextQuestionId: "Q5_ENG", answer: "Go to Q5"}],
                pathPreviewPdf: "",
                template_id: null
            })

            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })

            await q3.save()

            let q4 = new QuestionService2({
                question_id: 'Q4_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_4.jpg",
                template_id: "T4"
            })

            await q4.save()

            let q5 = new QuestionService2({
                question_id: 'Q5_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_5.jpg",
                template_id: "T5"
            })

            await q5.save()

            questionStartId = "Q1_ENG"
            questionEndId = "Q5_ENG"
            language = "ENG"
            service = "2"

            let res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(3)
            expect(res.body[0]).toBe(q1.question_id)
            expect(res.body[1]).toBe(q2.question_id)
            expect(res.body[2]).toBe(q5.question_id)
            expect(res.body).not.toContain(q3.question_id);
            expect(res.body).not.toContain(q4.question_id);  
        })

        it("should return 404 if no path is found between the two questions of service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}, 
                    {nextQuestionId: "Q3_ENG", answer: "Go to Q3"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [{nextQuestionId: "Q4_ENG", answer: "Go to Q4"}, 
                    {nextQuestionId: "Q5_ENG", answer: "Go to Q5"}],
                pathPreviewPdf: "",
                template_id: null
            })

            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })

            await q3.save()

            let q4 = new QuestionService2({
                question_id: 'Q4_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_4.jpg",
                template_id: "T4"
            })

            await q4.save()

            let q5 = new QuestionService2({
                question_id: 'Q5_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_5.jpg",
                template_id: "T5"
            })

            await q5.save()

            questionStartId = "Q3_ENG"
            questionEndId = "Q5_ENG"
            language = "ENG"
            service = "2"

            let res = await exec()

            expect(res.status).toBe(404)
        })
        
    })

    describe("/getRemovableQuestions/:service/:language", () => {

        let service
        let language

        const exec = async () => {
            return await request(server).get("/getRemovableQuestions/"+service+"/"+language)
        }

        it("should return 400 if language is less than 3 characthers", async () => {
            language = "IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is more than 3 characthers", async () => {
            language = "ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            language = "ENG"
            service = "not_a_service"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 404 if no removable questions for service 2 are found in DB", async () => {
            language = "ENG"
            service = "2"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return all removable questions for service 2 if they exist", async () => {

            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}, 
                    {nextQuestionId: "Q3_ENG", answer: "Go to Q3"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [{nextQuestionId: "Q4_ENG", answer: "Go to Q4"}, 
                    {nextQuestionId: "Q5_ENG", answer: "Go to Q5"}],
                pathPreviewPdf: "",
                template_id: null
            })

            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })

            await q3.save()

            let q4 = new QuestionService2({
                question_id: 'Q4_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_4.jpg",
                template_id: "T4"
            })

            await q4.save()

            let q5 = new QuestionService2({
                question_id: 'Q5_ENG',
                language: "ENG",
                text: "",
                previousQuestion: "Q2_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_5.jpg",
                template_id: "T5"
            })

            await q5.save()

            language = "ENG"
            service = "2"

            let res = await exec()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body[0].question_id).toBe(q1.question_id);
            expect(res.body[1].question_id).toBe(q2.question_id);
        })
        
    })

    describe("/addQuestion/:service/:language", () => {

        let service
        let language
        let question_id
        let text
        let template_id
        let pathPreviewPdf
        let previousQuestion
        let nextQuestion
        let answer

        const exec = async () => {
            return await request(server)
                .post("/addQuestion/"+service+"/"+language)
                .send({
                    question_id: question_id,
                    previousQuestion: previousQuestion,
                    text: text,
                    language: language,
                    template_id: template_id,
                    pathPreviewPdf: pathPreviewPdf,
                    nextQuestion: nextQuestion,
                    previousQuestion: previousQuestion,
                    answer: answer
                })
        }

        it("should return 400 if language is less than 3 characthers", async () => {
            language = "IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if language is more than 3 characthers", async () => {
            language = "ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        /*it("should return 400 if question_id is less than 6 characters", async () => {
            question_id = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if question_id is more than 7 characters", async () => {
            question_id = "Q1_ENGL"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })*/

        it("should return 404 if service is not found", async () => {
            question_id = "Q1_ENG"
            language = "ENG"
            service = "not_a_service"

            const res = await exec()
    
            expect(res.status).toBe(404)
        })

        it("should return 400 if a question for service 2 with the same text and language is found in DB", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Test question",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"
            text = "Test question"

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it("should insert the first question for service 2 if tree is empty", async () => {
            nextQuestion = "NaN"
            previousQuestion = "NaN"
            text = "First question"
            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            let questionAdded = await QuestionService2.find({question_id: question_id, language: language})
            questionAdded = questionAdded[0]

            expect(res.status).toBe(200)
            expect(questionAdded.question_id).toBe("Q1_ENG")
            expect(questionAdded.language).toBe("ENG")
            expect(questionAdded.nextQuestions.length).toBe(0)
            expect(questionAdded.previousQuestion).toBe(null)
            expect(questionAdded.text).toBe("First question")
        })

        it("should insert a new root question for service", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "First question",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            nextQuestion = q1.question_id
            previousQuestion = "NaN"
            text = "Second question"
            question_id = "Q2_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            let root = await QuestionService2.find({question_id: "Q2_ENG", language: language})
            root = root[0]

            let oldRoot = await QuestionService2.find({question_id: "Q1_ENG", language: language})
            oldRoot = oldRoot[0]

            expect(res.status).toBe(200)
            expect(root.question_id).toBe("Q2_ENG")
            expect(root.language).toBe("ENG")
            expect(root.nextQuestions.length).toBe(1)
            expect(root.nextQuestions[0].nextQuestionId).toBe("Q1_ENG")
            expect(root.previousQuestion).toBe(null)
            expect(root.text).toBe("Second question")

            expect(oldRoot.previousQuestion).toBe("Q2_ENG")
        })
        
    })

})