const Massage = require("../models/Massage")

const getAllMassage = async (req, res) => {
    const Massages = await Massage.find().lean()
    if (!Massages?.length) {
        return res.status(400).json({ message: 'No Massages found' })
    }
    res.json(Massages)
}

const createNewMassage = async (req, res) => {

    const { userID,body } = req.body
    if (!userID || !body) {
        return res.status(400).json({ message: 'No parameters' })
    } 

    const massage = await Massage.create({userID,body})
    if (massage) {
        return res.status(201).json({ message: 'New Massage created' })
    }
    else { 
        return res.status(400).json({ message: 'Invalid Massage ' })
    }

}
// const getUserById = async (req, res) => {
//     const { id } = req.params
//     const user = await Massage.findById(id).lean()
//     if (!user) {
//         return res.status(400).json({ message: 'No user found' })
//     }
//     res.json(user)
// }

// const updateMassage = async (req, res) => {
//     const { _id, userID,body } = req.body
//     if (!_id || !userID || !body) {
//         return res.status(400).json({ message: 'fields are required' })
//     }
//     const massage = await Massage.findById(_id).exec()
//     if (!massage) {
//         return res.status(400).json({ message: 'Massage not found' })
//     }
//     massage.body=body
//     massage.userID=userID
//     const updatedMassage = await massage.save()
//     res.json(`'${updatedMassage.body}' updated`)
// }

const deleteMassage = async (req, res) => {
    const { _id } = req.body
    const massage = await Massage.findById(_id).exec()
    if (!massage) {
        return res.status(400).json({ message: 'Massage not found' })
    }
    const result = await massage.deleteOne()
    res.json(result)
}

module.exports = { getAllMassage, createNewMassage, deleteMassage}