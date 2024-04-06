const mongoose = require("mongoose")

const articletSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('Article', articletSchema)