const express = require("express")
const router = express.Router()
const articleController = require("../controllers/articleController")

router.get("/",articleController.getAllArticle)
// router.get("/:id",articleController.getUserById)

router.post("/",articleController.createNewArticle)

router.put("/",articleController.updateArticle)

router.delete("/",articleController.deleteArticle)

module.exports = router
