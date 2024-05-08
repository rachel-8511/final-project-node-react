const express = require("express")
const router = express.Router()
const orderController = require("../controllers/orderController")
const verifyJWT = require("../middleware/verifyJWT")
const verifyAdmin = require("../middleware/verifyAdmin")




router.use(verifyJWT)

router.get("/:id",orderController.getOrdersById)
router.post("/",orderController.createNewOrder)

router.use(verifyAdmin)
router.put("/",orderController.updateOrder)
router.get("/",orderController.getAllOrder)

module.exports = router
