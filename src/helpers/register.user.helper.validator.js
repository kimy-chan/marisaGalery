const { body } = require("express-validator");
function registerUserValidator() {
    return [
        body("name", "nombre invalido").matches(/^[a-zA-Z\s]+$/),
        body("lastNames", "Apellidos invalido").matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/),
        body("email", "email invalido").isEmail(),
        body("password", "contraseña invalida").notEmpty()
    ]
}

module.exports = registerUserValidator