const express = require("express");
const indexController = require("../controller/index.controller");

const router = express.Router();

router.get("/index", indexController.index);//plantilla principal

router.get("/", indexController.portadaIndex); //portada de la tienda
router.get("/cant-cart", indexController.cartCantidad); //cantidad del carrito


// footer ritas
router.get("/metodo-pago", indexController.infoMetodoPago);//metodos de pago
router.get("/Preguntas-frecuentes", indexController.PreguntasFrecuentes);//pregunta frecuentes
module.exports = router;
