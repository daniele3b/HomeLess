const { QuestionService2 } = require("../models/questionService2");
const axios = require("axios")
const config = require("config")

// Used for getTree functions
let questionsArray = []

// Recursively removes the subtree starting from a question for service 2
async function removeQuestionService2(question){

    // [BASIC STEP] If I am on a leaf question
    if(question.nextQuestions.length == 0){

        // Invoke homel_2 to remove the template identified by the current template_id in the the given language
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

        // Remove the question from DB, and return because this is the basic step of recursions
        await QuestionService2.remove({question_id: question.question_id, language: question.language})
        return
    }
    
    // [RECURSIVE STEP]
    else{
        let i
        const dim = question.nextQuestions.length

        // For each question of nextQuestions of the actual question
        for(i=0;i<dim;i++){

            // Take a child, that represents my next node
            let next = await QuestionService2.find({question_id: question.nextQuestions[i].nextQuestionId,
                language: question.language})
            next = next[0]
            
            // Call the recursione with this next node
            removeQuestionService2(next)
        }

        // After for cycle, I can remove my question from DB
        await QuestionService2.remove({question_id: question.question_id, language: question.language})

    }
}

// Aux function for getTree function
async function getTreeAux(question){

    // [BASIC STEP] If I am on a leaf question
    if(question.nextQuestions.length == 0){
        
        // Push the question in the global questionsArray array, and return because this is the basic step of recursion
        return new Promise(function(resolve, reject){
            questionsArray.push(question.question_id)

            resolve("Leaf")
        })
    }
    
    // [RECURSIVE STEP]
    else{
        let i
        const dim = question.nextQuestions.length

        // For each question in nextQuestions' array of the current question
        for(i=0;i<dim;i++){

            // I call recursion
            let next = await QuestionService2.find({question_id: question.nextQuestions[i].nextQuestionId,
                language: question.language})
            next = next[0]

            await getTreeAux(next)
        }

        // After for cycle I can push the actual question
        return new Promise(function(resolve, reject){
            questionsArray.push(question.question_id)

            resolve("Finished")
        })

    }
}

// Get all tree or subtree starting from a given question
// N.B.: I use promises only for for the inherently asynchronous nature of Node.js
function getTree(question){
    
    return new Promise(function(resolve, reject){
        questionsArray = []

        getTreeAux(question)
        .then(() => {
            resolve(questionsArray)
        })
    })
}

// Get the path starting from a start question and ending to an end question
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