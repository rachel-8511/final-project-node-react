const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const multer = require("multer")
const verifyJWT=require('../middleware/verifyJWT')
const verifyAdmin=require('../middleware/verifyAdmin')

const storage = multer.diskStorage({
    destination: function (req, res, cb){
        cb(null, './public/uploads')
    },
    filename : function(req, res, cb){
        const uniqeSuffix = Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null, uniqeSuffix +".jpg")
    }
})

const upload = multer({storage:storage})

router.get("/",productController.getAllProduct)

router.get("/:id",productController.getProductById)

router.use(verifyJWT)
router.use(verifyAdmin)
router.post("/",upload.array('imageURL'),productController.createNewProduct)

router.put("/",upload.array('imageURL'),productController.updateProduct)

router.delete("/",productController.deleteProduct)

module.exports = router

