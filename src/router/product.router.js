const express = require("express");
const upload = require("../middleware/upload.img.middleware")
const productValidator = require("../helpers/product.helper.validator")
const productController = require("../controller/product.controller")
const productValidatorUpdate = require("../helpers/updateProduct.helper")
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware")

const router = express.Router();

router.post("/add-product", [VerifyCookie, rolesUser, upload.array("imagenes"), productValidator()], productController.addProduct)
router.get("/add-product", [VerifyCookie, rolesUser], productController.formProduct)
router.get("/decription/:idProduct", (req, res) => { productController.descriptionProduct(req, res) })
router.get("/delete-product/:idProduct", [VerifyCookie, rolesUser], productController.deleteProduct)
router.get("/update-product/:idProduct", [VerifyCookie, rolesUser], productController.formUpdateProdcut)
router.post("/update-product/:idProduct", [VerifyCookie, rolesUser, upload.array("imagenes"), productValidatorUpdate()], productController.updateProduct)
module.exports = router;