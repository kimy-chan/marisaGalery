const express = require("express");
const cartController=require("../controller/cart.controller")
const router = express.Router();

router.get("/add-cart/:idCart",cartController.addCart)
router.get("/cart",cartController.cart)
router.get("/cart/:idProduct",cartController.deleteCartProduct )






module.exports= router;