const express = require("express");
const contactoController = require("../controller/contactos.controller")

const router = express.Router();

router.get("/contacto", contactoController.contacto)

module.exports = router;
