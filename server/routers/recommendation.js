const express = require("express")
const router = express.Router()
const recommendationController = require("../controllers/recommendationController")

router.get("/",recommendationController.getAllRecommendation)
// router.get("/:id",recommendationController.getUserById)

router.post("/",recommendationController.createNewRecommendation)

// router.put("/",recommendationController.updateUser)

router.delete("/",recommendationController.deleteRecommendation)

module.exports = router
