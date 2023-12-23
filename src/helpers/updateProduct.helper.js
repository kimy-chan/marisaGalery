const { body } = require("express-validator");
function productValidatorUpdate() {
    return [
        body("nombre").matches(/^[a-zA-Z\s]+$/),
        body("descripcion").custom(value => {
            if (value && !/^[a-zA-Z0-9\s.,áéíóúÁÉÍÓÚñÑ]+$/.test(value)) {
                throw new Error('Texto inválido: solo se permiten letras, números, puntos, comas y espacios');
            }
            return true;
        }),
        body("cantidad").isNumeric(),
        body("precio").notEmpty().isNumeric(),
        body("tallas").matches(/^(?:[a-zA-Z\s]*)$/),
        body("colores").matches(/^[a-zA-Z\s]+$/)
    ]
}
module.exports = productValidatorUpdate;