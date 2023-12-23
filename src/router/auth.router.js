const express = require("express");
const AuthController = require("../controller/auth.controller")
const { loginValidator } = require("../helpers/auth.helper.validator")



const router = express.Router();
router.post("/login", [loginValidator()], AuthController.login);
router.get("/login", AuthController.formLogin)
router.get("/logout", AuthController.logout)




module.exports = router;