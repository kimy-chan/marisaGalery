const express = require("express");
const userController = require("../controller/user.controller")
const userValidator = require("../helpers/register.user.helper.validator")
const VerifyCookie = require("../middleware/cookie.middleware");
const rolesUser = require("../middleware/roles.middleware")

const router = express.Router();
router.post("/register", [VerifyCookie, rolesUser, userValidator()], userController.registerUser);
router.get("/user", [VerifyCookie, rolesUser], userController.getUserPanel); //obtener todos los usuarios disponibles
router.get("/register", [VerifyCookie, rolesUser], userController.getUserPanelForm);

router.get("/register-delete/:idPerson", [VerifyCookie, rolesUser], userController.deleteUserPanel); //borrar un usuario




module.exports = router;