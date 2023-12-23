const express = require("express");
const SalesController = require("../controller/sales.controller")
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware")


const router = express.Router();

router.get("/ventas", [VerifyCookie, rolesUser], SalesController.getSales)
router.get("/delete-sales/:idSales", [VerifyCookie, rolesUser], SalesController.deleteSales)


module.exports = router;