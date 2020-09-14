const { QuestionService2 } = require("../models/questionService2");
const axios = require("axios")
const config = require("config")
let questionsArray = []


async function removeQuestionService2(question){
    if(question.nextQuestions.length == 0){

        const options = {
            url: config.get("homel_2")+"/removeTemplate/"+question.language+"/"+question.template_id,
            method: "delete"
        }

        axios(options)
        .then((response) => {
            console.log(response.data)
        })
        .catch((err) => {
            console.log(err)
        })

        await QuestionService2.remove({question_id: question.question_id, language: question.language})
        return
    }
    
    else{
        let i
        const dim = question.nextQuestions.length

        for(i=0;i<dim;i++){

            let next = await QuestionService2.find({question_id: question.nextQuestions[i].nextQuestionId,
                language: question.language})
            next = next[0]

            removeQuestionService2(next)
        }

        await QuestionService2.remove({question_id: question.question_id, language: question.language})

    }
}

async function getTreeAux(question){
    if(question.nextQuestions.length == 0){
        return new Promise(function(resolve, reject){
            questionsArray.push(question.question_id)

            resolve("Leaf")
        })
    }
    
    else{
        let i
        const dim = question.nextQuestions.length

        for(i=0;i<dim;i++){

            let next = await QuestionService2.find({question_id: question.nextQuestions[i].nextQuestionId,
                language: question.language})
            next = next[0]

            await getTreeAux(next)
        }

        return new Promise(function(resolve, reject){
            questionsArray.push(question.question_id)

            resolve("Finished")
        })

    }
}

function getTree(question){
    
    return new Promise(function(resolve, reject){
        questionsArray = []

        getTreeAux(question)
        .then(() => {
            resolve(questionsArray)
        })
    })
}

exports.removeQuestionService2 = removeQuestionService2
exports.getTree = getTree
exports.questionsArray = questionsArray