const express = require("express")
const router = express.Router()
const commonQuestionController = require("../controllers/commonQuestionController")

router.get("/",commonQuestionController.getAllCommonQuestion)
// router.get("/:id",commonQuestionController.getUserById)

router.post("/",commonQuestionController.createNewCommonQuestion)

router.put("/",commonQuestionController.updateCommonQuestion)

router.delete("/",commonQuestionController.deleteCommonQuestion)

module.exports = router
