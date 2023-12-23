const express = require("express");
const SuscriptorController = require("../controller/suscriptores.controller");
const suscriptorValidator = require("../helpers/suscriptor.helper.validator");
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware");



const router = express.Router();

router.post("/suscribirse", [suscriptorValidator()], SuscriptorController.addSuscriptor)
router.get("/suscriptores", [VerifyCookie, rolesUser], SuscriptorController.getSuscriptores)

router.get("/delete-suscriptor/:idPerson", [VerifyCookie, rolesUser], SuscriptorController.deleteSuscriptorPanel)
router.post("/send-email", [VerifyCookie, rolesUser], SuscriptorController.sendEmail)

module.exports = router;