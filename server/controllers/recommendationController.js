const Recommendation = require("../models/Recommendation")

const getAllRecommendation = async (req, res) => {
    const Recommendations = await Recommendation.find().lean()
    if (!Recommendations?.length) {
        return res.status(400).json({ message: 'No Recommendations found' })
    }
    res.json(Recommendations)
}

const createNewRecommendation = async (req, res) => {

    const { userID,content } = req.body
    if (!userID || !content) {
        return res.status(400).json({ message: 'No parameters' })
    } 

    const recommendation = await Recommendation.create({userID,content})
    if (recommendation) {
        return res.status(201).json({ message: 'New Recommendation created' })
    }
    else { 
        return res.status(400).json({ message: 'Invalid Recommendation ' })
    }

}
// const getUserById = async (req, res) => {
//     const { id } = req.params
//     const user = await Recommendation.findById(id).lean()
//     if (!user) {
//         return res.status(400).json({ message: 'No user found' })
//     }
//     res.json(user)
// }

// const updateRecommendation = async (req, res) => {
//     const { _id, userID,body } = req.body
//     if (!_id || !userID || !body) {
//         return res.status(400).json({ message: 'fields are required' })
//     }
//     const Recommendation = await Recommendation.findById(_id).exec()
//     if (!Recommendation) {
//         return res.status(400).json({ message: 'Recommendation not found' })
//     }
//     Recommendation.body=body
//     Recommendation.userID=userID
//     const updatedRecommendation = await Recommendation.save()
//     res.json(`'${updatedRecommendation.body}' updated`)
// }

const deleteRecommendation = async (req, res) => {
    const { _id } = req.body
    const recommendation = await Recommendation.findById(_id).exec()
    if (!recommendation) {
        return res.status(400).json({ message: 'Recommendation not found' })
    }
    const result = await recommendation.deleteOne()
    res.json(result)
}

module.exports = { getAllRecommendation, createNewRecommendation, deleteRecommendation}