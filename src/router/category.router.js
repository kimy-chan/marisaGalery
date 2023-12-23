const express = require("express");
const categoryController = require("../controller/category.controller")
const upload = require("../middleware/upload.img.middleware")
const categoryValidator = require("../helpers/category.helper.validator")
const updateCategoriaVali = require("../helpers/update.category.helepr")
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware")
const router = express.Router();

router.get("/products/:nameProduct", categoryController.showProduct)
router.get("/update-category/:idCategory", [VerifyCookie, rolesUser], categoryController.updateCategoryForm)
router.post("/update-category/:idCategory", [VerifyCookie, rolesUser, upload.single("images"), updateCategoriaVali()], categoryController.updateCategory)
router.get("/delete-category/:idCategory/:idImagen", [VerifyCookie, rolesUser], categoryController.deleteCategory)
router.post("/add-category", [VerifyCookie, rolesUser, upload.single("images"), categoryValidator()], categoryController.addCategory)


module.exports = router;