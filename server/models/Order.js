const mongoose = require("mongoose")
const addressSchema=require("./Address")
const orderSchema = new mongoose.Schema(
    {
        customer_id: {
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User"
        },
        products: {
            type: [
                {
                    product_id:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"Product",
                        required: true
                    },
                    quantity:{
                        type:Number,
                        required: true
                    },
                    imageURL: {
                        type: String,
                        required:true
                    },
                    description: {
                        type:String,
                        required:true
                    }
                }

            ],
            required:true
        },
        status: {
             type: String,
            enum: ["Ordered","In Process","Shipped","Delivered"],
            default: "Ordered"
        },
        payment:{
            type:Number,
            required:true
        },
        address:{
            type:addressSchema,
            required:true
        }
    }, 
    {
        timestamps: true
    })
 
module.exports = mongoose.model('Order', orderSchema)