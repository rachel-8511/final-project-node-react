const mongoose = require("mongoose")

const RecommendationSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"User"
        },
        content: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('Recommendation', RecommendationSchema)