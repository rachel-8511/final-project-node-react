const express = require("express")
const router = express.Router()
const massageController = require("../controllers/massageController")

router.get("/",massageController.getAllMassage)
// router.get("/:id",massageController.getUserById)

router.post("/",massageController.createNewMassage)

// router.put("/",massageController.updateMassage)

router.delete("/",massageController.deleteMassage)

module.exports = router
