const Users = require("../models/User")
const bcrypt = require('bcrypt')
const Products = require("../models/Product")
const jwt = require('jsonwebtoken')

const getAllUsers = async (req, res) => {
    const users = await Users.find({}, { password: 0 }).lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
}

const createNewUser = async (req, res) => {

    const { password, firstName, lastName, email, phone, user_id, roles, basket, defaultAddress } = req.body
    if (!password || !firstName || !lastName || !email) {
        return res.status(400).json({ message: 'No parameters' })
    }
    if (await Users.find({ email: email }).exec()) {
        return res.status(400).json({ message: 'username exist' })
    }
    if (roles) {
        if (!["user", "admin"].find(r => r == roles)) {
            return res.status(400).json({ message: 'roles not valid' })
        }
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await Users.create({ password: hashedPwd, firstName, lastName, email, phone, user_id, roles, basket, defaultAddress })
    if (user) {
        return res.status(201).json({ message: 'New userHM created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid userHM ' })
    }

}

const updateBasket = async (req, res) => {
    const basket = req.body
    if (!basket) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(req.user._id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    user.basket = basket
    const updatedUser = await user.save()
 
    const userInfo =
    {  
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken, updatedUser: updatedUser })
}
 
const getUserById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(id).lean()
    if (!user) {
        return res.status(400).json({ message: 'No user found' })
    }
    res.json(user)
}

const updateUser = async (req, res) => {
    const { _id, password, firstName, lastName, phone, user_id, roles, active } = req.body
    if (!_id || !firstName || !lastName) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(_id).exec()
    if (roles) {
        if (!["user", "admin"].find(r => r === roles)) {
            return res.status(400).json({ message: 'roles not valid' })
        }
    }

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    if (password) {
        const hashedPwd = await bcrypt.hash(password, 10)
        user.password = hashedPwd
    }
    user.active = active ? active : user.active
    user.roles = roles ? roles : user.roles
    user.firstName = firstName
    user.lastName = lastName
    user.phone = phone
    user.user_id = user_id

    const updatedUser = await user.save()

    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken, updatedUser: updatedUser })
}

const addProduct = async (req, res) => {
    const { _id, product_id, quantity, imageURL, description } = req.body

    if (!_id || !product_id || !quantity || !description) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(_id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }
    const product = await Products.findById(product_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Product`s quantity is not enough' })
    }
    const checkIfExist = (user.basket.products).find(p => {
        if (p.product_id == product_id) {
            p.quantity = p.quantity + quantity
        }
        return (p.product_id == product_id)
    })

    if (checkIfExist == undefined) {
        user.basket.products = [...user.basket.products, { product_id: product_id, quantity: quantity, imageURL: imageURL, description: description }]
    }
    user.basket.payment = user.basket.payment + product.price * quantity
    const updatedUser = await user.save()
    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const deleteProduct = async (req, res) => {
    const { _id, product_id } = req.body
    if (!_id || !product_id) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const product = await Products.findById(product_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }

    const new_products = user.basket.products.filter(p => {
        if (p.product_id == product_id) {
            user.basket.payment = user.basket.payment - product.price * p.quantity
        }
        return p.product_id != product_id
    })

    user.basket.products = new_products
    const updatedUser = await user.save()
    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const updateProductQuantity = async (req, res) => {
    const { _id, product_id, quantity } = req.body
    if (!_id || !product_id || !quantity) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const user = await Users.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const product = await Products.findById(product_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }


    const new_products = user.basket.products.map(p => {
        if (p.product_id == product_id) {
            user.basket.payment = user.basket.payment + product.price * (quantity - p.quantity)
            p.quantity = quantity
        }
        return p
    })

    user.basket.products = new_products
    const updatedUser = await user.save()
    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const addDefaultAddress = async (req, res) => {
    const { _id, firstName, lastName, city, street, houseNumber, apartment, postalCode, phone } = req.body

    if (!_id || !firstName || !lastName || !city || !street || !houseNumber || !postalCode || !phone) {
        return res.status(400).json({ message: 'Field missing!' })
    }

    const user = await Users.findById(_id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    user.defaultAddress = { firstName, lastName, city, street, houseNumber: Number(houseNumber), apartment: Number(apartment), postalCode, phone }
    const updatedUser = await user.save()
    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const cleaningBasket = async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Field missing!' })
    }

    const user = await Users.findById(_id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    user.basket.products = []
    user.basket.payment = 0
    const updatedUser = await user.save()
    const userInfo =
    {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        user_id: updatedUser.user_id,
        roles: updatedUser.roles,
        basket: updatedUser.basket,
        defaultAddress: updatedUser.defaultAddress,
        phone: updatedUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const deleteUser = async (req, res) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(400).json({ message: 'No parameters' })
    }
    const user = await Users.findById(_id).exec()
    if (!user) {
        return res.status(400).json({ message: 'UserHM not found' })
    }
    const result = await user.deleteOne()
    res.json(result)
}

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser, getUserById, addProduct, deleteProduct, addDefaultAddress, updateProductQuantity, cleaningBasket,updateBasket }