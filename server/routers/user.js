const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')

router.use(verifyJWT)
router.put("/", userController.updateUser)
router.put("/addProduct", userController.addProduct)
router.put("/deleteProduct", userController.deleteProduct)
router.put("/updateProductQuantity", userController.updateProductQuantity)
router.put("/addDefaultAddress", userController.addDefaultAddress)
router.put("/cleaningBasket", userController.cleaningBasket)
router.put("/updateBasket", userController.updateBasket)

router.use(verifyAdmin)
router.get("/", userController.getAllUsers)


module.exports = router
