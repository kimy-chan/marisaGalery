const express = require("express");
const pedidosValidator = require("../helpers/pedidos.helper.validator")
const PedidosController = require("../controller/pedidos.controller")
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware");


const router = express.Router();

router.get("/pedido", PedidosController.pedido)
router.post("/pedido", [pedidosValidator()], PedidosController.pedidoFinal)
router.get("/get-order", [VerifyCookie, rolesUser], PedidosController.getAllOrder)
router.get("/vender/:idOrder", [VerifyCookie, rolesUser], PedidosController.stateOrder)
router.get("/delete-pedido/:idPersonOrder", [VerifyCookie, rolesUser], PedidosController.deteleOrder)

module.exports = router;