const CommonQuestion = require("../models/CommonQuestion")

const getAllCommonQuestion = async (req, res) => {
    const CommonQuestions = await CommonQuestion.find().lean()
    if (!CommonQuestions?.length) {
        return res.status(400).json({ message: 'No CommonQuestions found' })
    }
    res.json(CommonQuestions)
}

const createNewCommonQuestion = async (req, res) => {

    const { question,answer } = req.body
    if (!question || !answer) {
        return res.status(400).json({ message: 'No parameters' })
    } 

    const commonQuestion = await CommonQuestion.create({question,answer})
    if (commonQuestion) {
        return res.status(201).json({ message: 'New CommonQuestion created' })
    }
    else { 
        return res.status(400).json({ message: 'Invalid CommonQuestion ' })
    }

}
// const getUserById = async (req, res) => {
//     const { id } = req.params
//     const user = await CommonQuestion.findById(id).lean()
//     if (!user) {
//         return res.status(400).json({ message: 'No user found' })
//     }
//     res.json(user)
// }

const updateCommonQuestion = async (req, res) => {
    const { _id,question,answer } = req.body
    if (!_id || !question || !answer) {
        return res.status(400).json({ message: 'fields are required' })
    }
    const commonQuestion = await CommonQuestion.findById(_id).exec()
    if (!commonQuestion) {
        return res.status(400).json({ message: 'CommonQuestion not found' })
    }
    commonQuestion.answer=answer
    commonQuestion.question=question
    const updatedCommonQuestion = await commonQuestion.save()
    res.json(`'${updatedCommonQuestion.answer}' updated`)
}

const deleteCommonQuestion = async (req, res) => {
    const { _id } = req.body
    const commonQuestion = await CommonQuestion.findById(_id).exec()
    if (!commonQuestion) {
        return res.status(400).json({ message: 'CommonQuestion not found' })
    }
    const result = await commonQuestion.deleteOne()
    res.json(result)
}

module.exports = { getAllCommonQuestion, createNewCommonQuestion, updateCommonQuestion, deleteCommonQuestion}