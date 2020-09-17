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

    describe("GET /getQuestion/:question_id/:service/:language", () => {

        let service
        let language
        let question_id

        const exec = async () => {
            return await request(server).get("/getQuestion/"+question_id+"/"+service+"/"+language)
        }

        it("should return 400 if question_id is invalid", async () => {
            question_id = "Q1_IT"

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

    describe("GET /getTreeFrom/:question_id/:service/:language", () => {

        let service
        let language
        let question_id

        const exec = async () => {
            return await request(server).get("/getTreeFrom/"+question_id+"/"+service+"/"+language)
        }

        it("should return 400 if question_id is invalid", async () => {
            question_id = "Q1_IT"

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

    describe("GET /getPath/from/:questionStartId/to/:questionEndId/:service/:language", () => {

        let service
        let language
        let questionStartId
        let questionEndId

        const exec = async () => {
            return await request(server)
                .get("/getPath/from/"+questionStartId+"/to/"+questionEndId+"/"+service+"/"+language)
        }

        it("should return 400 if questionStartId is invalid", async () => {
            questionStartId = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if questionEndId is invalid", async () => {
            questionEndId = "Q5_IT"

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

    describe("GET /getRemovableQuestions/:service/:language", () => {

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
            expect(res.body.some(q => q.question_id == q1.question_id)).toBeTruthy()
            expect(res.body.some(q => q.question_id == q2.question_id)).toBeTruthy()
            expect(res.body.some(q => q.question_id == q3.question_id)).toBeFalsy()
            expect(res.body.some(q => q.question_id == q4.question_id)).toBeFalsy()
            expect(res.body.some(q => q.question_id == q5.question_id)).toBeFalsy()
        })
        
    })

    describe("POST /addQuestion/:service/:language", () => {

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

        it("should return 400 if question_id is invalid", async () => {
            question_id = "Q1_IT"

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

        it("should insert a new root question for service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Old root question",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            nextQuestion = q1.question_id
            previousQuestion = "NaN"
            text = "New root question"
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
            expect(root.text).toBe("New root question")

            expect(oldRoot.previousQuestion).toBe("Q2_ENG")
        })

        it("should return 400 if previousQuestionId is invalid for a leaf insertion", async () => {
            nextQuestion = "NaN"
            previousQuestion = "Q1_EN"
            text = "Leaf question"
            question_id = "Q2_ENG"
            language = "ENG"
            service = "2"
            answer = "Go to Q2"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("[no template_id] should insert a new leaf question for service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            nextQuestion = "NaN"
            previousQuestion = q1.question_id
            text = "Leaf question"
            question_id = "Q2_ENG"
            language = "ENG"
            service = "2"
            answer = "Go to Q2"

            const res = await exec()

            let root = await QuestionService2.find({question_id: "Q1_ENG", language: language})
            root = root[0]

            const rootOldNextQuestionsLength = q1.nextQuestions.length

            let leaf = await QuestionService2.find({question_id: "Q2_ENG", language: language})
            leaf = leaf[0]

            expect(res.status).toBe(200)
            expect(leaf.question_id).toBe("Q2_ENG")
            expect(leaf.language).toBe("ENG")
            expect(leaf.nextQuestions.length).toBe(0)
            expect(leaf.previousQuestion).toBe("Q1_ENG")
            expect(leaf.text).toBe("Leaf question")

            const rootNewNextQuestionsLength = rootOldNextQuestionsLength + 1
            expect(root.nextQuestions.length).toBe(rootNewNextQuestionsLength)
            expect(root.nextQuestions.some(q => q.nextQuestionId == "Q2_ENG" && q.answer == "Go to Q2")).toBeTruthy()
        })

        it("[with template_id] should insert a new leaf question for service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "Old leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_2.jpg",
                template_id: "T2"
            })
            
            await q2.save()

            nextQuestion = "NaN"
            previousQuestion = q2.question_id
            text = "New Leaf question"
            question_id = "Q3_ENG"
            language = "ENG"
            service = "2"
            template_id = "T3"
            pathPreviewPdf = "preview_3.jpg"
            answer = "Go to Q3"

            const res = await exec()

            let oldLeaf = await QuestionService2.find({question_id: "Q2_ENG", language: language})
            oldLeaf = oldLeaf[0]

            let newLeaf = await QuestionService2.find({question_id: "Q3_ENG", language: language})
            newLeaf = newLeaf[0]

            expect(res.status).toBe(200)

            expect(newLeaf.question_id).toBe("Q3_ENG")
            expect(newLeaf.language).toBe("ENG")
            expect(newLeaf.nextQuestions.length).toBe(0)
            expect(newLeaf.previousQuestion).toBe("Q2_ENG")
            expect(newLeaf.text).toBe("New Leaf question")
            expect(newLeaf.template_id).toBe("T3")
            expect(newLeaf.pathPreviewPdf).toBe("preview_3.jpg")

            const oldLeafOldNextQuestionLength = q2.nextQuestions.length

            const oldLeafNewNextQuestionLength = oldLeafOldNextQuestionLength + 1
            expect(oldLeaf.nextQuestions.length).toBe(oldLeafNewNextQuestionLength)
            expect(oldLeaf.nextQuestions.some(q => q.nextQuestionId == "Q3_ENG" && q.answer == "Go to Q3")).toBeTruthy()
            expect(oldLeaf.pathPreviewPdf).toBe("")
            expect(oldLeaf.template_id).toBe(null)
        })

        it("should return 400 if question for service 2 with the same template_id is found in DB", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "Old leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_2.jpg",
                template_id: "T2"
            })
            
            await q2.save()

            nextQuestion = "NaN"
            previousQuestion = q2.question_id
            text = "New Leaf question"
            question_id = "Q3_ENG"
            language = "ENG"
            service = "2"
            template_id = "T2"
            pathPreviewPdf = "preview_3.jpg"

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it("should return 400 if previousQuestionId is invalid for a middle insertion", async () => {
            nextQuestion = "Q2_ENG"
            previousQuestion = "Q1_EN"
            text = "Middle question"
            question_id = "Q3_ENG"
            language = "ENG"
            service = "2"
            answer = "Go to Q3"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if nextQuestionId is invalid for a middle insertion", async () => {
            nextQuestion = "Q2_EN"
            previousQuestion = "Q1_ENG"
            text = "Middle question"
            question_id = "Q3_ENG"
            language = "ENG"
            service = "2"
            answer = "Go to Q3"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if it is impossible to create a link between the two questions specified for service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
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
                text: "Q2 leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_2.jpg",
                template_id: "T2"
            })
            
            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "Q3 leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })
            
            await q3.save()

            nextQuestion = q3.question_id
            previousQuestion = q2.question_id
            text = "New question"
            question_id = "Q4_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it("should insert a new question between two questions", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            let q2 = new QuestionService2({
                question_id: 'Q2_ENG',
                language: "ENG",
                text: "Q2 leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_2.jpg",
                template_id: "T2"
            })
            
            await q2.save()

            nextQuestion = q2.question_id
            previousQuestion = q1.question_id
            text = "New question"
            question_id = "Q3_ENG"
            language = "ENG"
            service = "2"
            answer = "Go to Q3"
            
            const res = await exec()
            expect(res.status).toBe(200)

            let prev = await QuestionService2.find({question_id: q1.question_id, language: language})
            prev = prev[0]

            let added = await QuestionService2.find({question_id: question_id, language: language})
            added = added[0]

            let next = await QuestionService2.find({question_id: q2.question_id, language: language})
            next = next[0]

            expect(prev.nextQuestions.some(q => q.nextQuestionId == added.question_id && q.answer == "Go to Q3")).toBeTruthy()

            expect(added.question_id).toBe("Q3_ENG")
            expect(added.previousQuestion).toBe("Q1_ENG")
            expect(added.nextQuestions.some(q => q.nextQuestionId == "Q2_ENG")).toBeTruthy()
            expect(added.text).toBe("New question")
            expect(added.language).toBe(language)

            expect(next.previousQuestion).toBe("Q3_ENG")
        })
        
    })

    describe("DELETE /removeQuestion/:question_id/:service/:language", () => {
        let service
        let language
        let question_id

        const exec = async () => {
            return await request(server)
                .delete("/removeQuestion/"+question_id+"/"+service+"/"+language)
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

        it("should return 400 if question_id is invalid", async () => {
            question_id = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            language = "ENG"
            service = "not_a_service"
            question_id = "Q1_ENG"

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

        it("should delete all tree if question_id for service 2 is tree's root", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Root question",
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
                text: "Q2 leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_2.jpg",
                template_id: "T2"
            })
            
            await q2.save()

            let q3 = new QuestionService2({
                question_id: 'Q3_ENG',
                language: "ENG",
                text: "Q3 leaf question",
                previousQuestion: "Q1_ENG",
                nextQuestions: [],
                pathPreviewPdf: "preview_3.jpg",
                template_id: "T3"
            })
            
            await q3.save()

            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            const res = await exec()

            expect(res.status).toBe(200)
            
            const tree = await QuestionService2.find({language: language})

            expect(tree.length).toBe(0)
        })

    })

    describe("PUT /modifyQuestion/:question_id/:service/:language", () => {
        let service
        let language
        let question_id
        let text
        let nextQuestions
        let template_id

        const exec = async () => {
            return await request(server)
                .put("/modifyQuestion/"+question_id+"/"+service+"/"+language)
                .send({
                    text: text,
                    nextQuestions: nextQuestions,
                    template_id: template_id
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

        it("should return 400 if question_id is invalid", async () => {
            question_id = "Q1_IT"

            const res = await exec()
    
            expect(res.status).toBe(400)
        })

        it("should return 400 if question's text is found in DB for another question in the same language", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "Same question's text",
                previousQuestion: null,
                nextQuestions: [],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            text = "Same question's text"

            const res = await exec()

            expect(res.status).toBe(400)
        })

        it("should return 404 if service is not found", async () => {
            language = "ENG"
            service = "not_a_service"
            question_id = "Q1_ENG"

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

        it("should update the question with the given id for service 2", async () => {
            let q1 = new QuestionService2({
                question_id: 'Q1_ENG',
                language: "ENG",
                text: "First question",
                previousQuestion: null,
                nextQuestions: [{nextQuestionId: "Q2_ENG", answer: "Go to Q2"}, 
                    {nextQuestionId: "Q3_ENG", answer: "Go to Q3"}],
                pathPreviewPdf: "",
                template_id: null
            })
            
            await q1.save()

            question_id = "Q1_ENG"
            language = "ENG"
            service = "2"

            text = "Root question"
            nextQuestions = [{nextQuestionId: "Q2_ENG", answer: "Go to question 2"}, 
                {nextQuestionId: "Q3_ENG", answer: "Go to question 3"}]
            template_id = "T1"

            const res = await exec()

            expect(res.status).toBe(200)

            let updatedQuestion = await QuestionService2.find({question_id: question_id, language: language})
            updatedQuestion = updatedQuestion[0]

            expect(updatedQuestion.text).not.toBe("First question")
            expect(updatedQuestion.text).toBe("Root question")

            expect(updatedQuestion.nextQuestions[0].answer).not.toBe("Go to Q2")
            expect(updatedQuestion.nextQuestions[0].answer).toBe("Go to question 2")

            expect(updatedQuestion.nextQuestions[1].answer).not.toBe("Go to Q3")
            expect(updatedQuestion.nextQuestions[1].answer).toBe("Go to question 3")
            
            expect(updatedQuestion.template_id).not.toBe(null)
            expect(updatedQuestion.template_id).toBe("T1")
        })
    })

})