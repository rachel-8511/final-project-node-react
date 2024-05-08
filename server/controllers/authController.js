const Users = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: 'Field missing!' })
    }
    const foundUser = await Users.findOne({ email }).lean()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const userInfo =
    {
        _id: foundUser._id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        user_id: foundUser.user_id,
        roles: foundUser.roles,
        basket: foundUser.basket,
        defaultAddress: foundUser.defaultAddress,
        phone: foundUser.phone
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token: accessToken })
}

const register = async (req, res) => {
    const { password, firstName, lastName, email, phone, user_id } = req.body

    if (!password || !firstName || !lastName || !email) {
        return res.status(400).json({ message: 'No parameters' })
    }
    const duplicate = await Users.findOne({ email: email }).lean()
    if (duplicate) {
        return res.status(409).json({ message: 'Username already exist' })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    const user = await Users.create({ password: hashedPwd, firstName, lastName, email, phone, user_id })
    if (user) {
        return res.status(201).json({ message: `New user ${user.firstName} created` })
    }
    else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}

module.exports = { login, register }