const Product = require("../models/Product")

const getAllProduct = async (req, res) => {
    const Products = await Product.find().lean()
    if (!Products?.length) {
        return res.status(400).json({ message: 'No Products found' })
    }
    res.json(Products)
}
const getProductById = async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id).lean()
    if (!product) {
        return res.status(400).json({ message: 'No product found' })
    }
    res.json(product)
}

const createNewProduct = async (req, res) => {
    const { name,description,price,quantity } = req.body
    if (!name || !price|| !req.files) {
        return res.status(400).json({ message: 'No parameters' })
    } 
    let imageURL=[]
    req.files.forEach(element => {
        imageURL.push(element.path)
    });
   
    const product = await Product.create({ name,imageURL,description,price,quantity})
    if (product) {
        return res.status(201).json(product)
    }
    else { 
        return res.status(400).json({ message: 'Invalid Product ' })
    }

}
 
 
const updateProduct = async (req, res) => {
    const { _id,name,description,price,quantity} = req.body
    if (!_id || !name || !price) {
        return res.status(400).json({ message: 'fields are required' })
    }
    const product = await Product.findById(_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }
    let imageURL=[]
    req.files?.forEach(element => {
        imageURL.push(element.path)
    });
    product.name=name
    product.imageURL=imageURL.length>0?imageURL: product.imageURL;
    product.description=description
    product.price=price
    product.quantity=quantity

    const updatedProduct = await product.save()
    res.json(updatedProduct)
}

const deleteProduct = async (req, res) => {
    const { _id } = req.body
   
    const product = await Product.findById(_id).exec()
    if (!product) {
        return res.status(400).json({ message: 'Product not found' })
    }
    const result = await product.deleteOne()
    res.json(result)
}

module.exports = { getAllProduct, createNewProduct, updateProduct, deleteProduct,getProductById}