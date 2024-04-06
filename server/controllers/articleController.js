const Article = require("../models/Article")

const getAllArticle = async (req, res) => {
    const Articles = await Article.find().lean()
    if (!Articles?.length) {
        return res.status(400).json({ message: 'No Articles found' })
    }
    res.json(Articles)
}

const createNewArticle = async (req, res) => {

    const { title,body } = req.body
    if (!body || !title) {
        return res.status(400).json({ message: 'No parameters' })
    } 

    const article = await Article.create({  title,body })
    if (article) {
        return res.status(201).json({ message: 'New article created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid article ' })
    }
}
// const getUserById = async (req, res) => {
//     const { id } = req.params
//     const user = await Article.findById(id).lean()
//     if (!user) {
//         return res.status(400).json({ message: 'No user found' })
//     }
//     res.json(user)
// }

const updateArticle = async (req, res) => {
    const { _id,title,body } = req.body
    if (!_id || !title || !body) {
        return res.status(400).json({ message: 'fields are required' })
    }

    const article = await Article.findById(_id).exec()

    if (!article) {
        return res.status(400).json({ message: 'UserHM not found' })
    }
    article.title=title
    article.body=body
    const updatedArticle = await article.save()
    res.json(`'${updatedArticle.title}' updated`)
}

const deleteArticle = async (req, res) => {
    const { _id } = req.body
    const article = await Article.findById(_id).exec()
    if (!article) {
        return res.status(400).json({ message: 'Article not found' })
    }
    const result = await Article.deleteOne()
    res.json(result)
}

module.exports = { getAllArticle, createNewArticle, updateArticle, deleteArticle}