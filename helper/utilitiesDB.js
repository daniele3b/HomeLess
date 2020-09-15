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

function getPath(questionStart, questionEnd){

    return new Promise(async function(resolve, reject){
        let path = []
        let actualQuestion = questionEnd

        // Loop until i am on the root
        while(actualQuestion.previousQuestion != null){
            
        // Push the actual question
            path.push(actualQuestion.question_id)
            
            // If the actual question is the startQuestion, i return my path
            if(actualQuestion.question_id == questionStart.question_id){
                resolve(path.reverse())
            } 

            // Else, i go up on the tree
            let previous = await QuestionService2.find({question_id: actualQuestion.previousQuestion, 
                language: actualQuestion.language})
        
            previous = previous[0]

            actualQuestion = previous
        }

        // Before returning an empty array, i have to check that if tree's root is my startQuestion: if it is,
        // i push it, because it is part of the path, otherwise it will be ignored by the while loop
        let qStart = await QuestionService2.find({previousQuestion: null, language: questionStart.language,});
        qStart = qStart[0]

        if(qStart.question_id == questionStart.question_id){
            path.push(qStart.question_id)
            resolve(path.reverse())
        }
    
        // Else, there is no path between these two questions
        path = []

        resolve(path)
    })

}

exports.removeQuestionService2 = removeQuestionService2
exports.getTree = getTree
exports.getPath = getPath