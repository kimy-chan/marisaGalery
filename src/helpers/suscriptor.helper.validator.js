const { body } = require("express-validator");
function suscriptorValidator() {
    return [
        body("names", "nombre inválido").matches(/^[a-zA-Z\s]+$/),
        body("email", "email inválido").isEmail(),
        body("texto")
            .optional()  // Hacer el campo opcional
            .custom(value => {
                if (value && !/^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]+$/.test(value)) {
                    throw new Error('Texto inválido: solo se permiten letras, números, puntos, comas y espacios');
                }
                return true;
            }),
    ];
}


module.exports = suscriptorValidator