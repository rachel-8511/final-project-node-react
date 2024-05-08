const Order = require("../models/Order")
const Product = require("../models/Product")

const getAllOrder = async (req, res) => {
    let Orders = {}
        Orders = await Order.find({
            status:{$in:["Ordered","In Process","Shipped"]}
        }).lean()
    if (!Orders?.length) {
        return res.status(400).json({ message: 'No Orders found' })
    }
    res.json(Orders)
}

const getOrdersById = async (req, res) => {
    const { id } = req.params
    const Orders = await Order.find({ customer_id: id }).sort({ createdAt: -1 }).lean()
    if (!Orders?.length) {
        return res.status(400).json({ message: 'No Orders found' })
    }
    res.json(Orders)
}

const createNewOrder = async (req, res) => {
    const { address } = req.body

    if (!address) {
        return res.status(400).json({ message: 'Field missing!' })
    }

    const order = await Order.create({ customer_id: req.user._id, products: req.user.basket.products, payment: req.user.basket.payment, address })

    if (order) {
        order.products.forEach(async p => {

            const product = await Product.findById(p.product_id)
            if (!product) {
                return res.status(400).json({ message: 'Product not found' })
            }

            product.quantity = product.quantity - p.quantity;
            const updatedOrder = await product.save()
        })
        return res.status(201).json({ message: 'New Order created' })
    }
    else {
        return res.status(400).json({ message: 'Invalid Order' })
    }

}


const updateOrder = async (req, res) => {
    const { _id, status } = req.body
    if (!_id || !status) {
        return res.status(400).json({ message: 'Field missing!' })
    }

    const order = await Order.findById(_id).exec()
    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }
    order.status = status

    const updatedOrder = await order.save()
    res.json(updatedOrder)
}

const deleteOrder = async (req, res) => {
    const { _id } = req.body
    const order = await Order.findById(_id).exec()
    if (!order) {
        return res.status(400).json({ message: 'Order not found' })
    }
    const result = await order.deleteOne()
    res.json(result)
}

module.exports = { getOrdersById, getAllOrder, createNewOrder, updateOrder, deleteOrder }