
const { body } = require("express-validator");
function updateCategoriaVali() {
    return [
        body("categoria").matches(/^[a-zA-Z\s,áéíóúÁÉÍÓÚñÑ]+$/),
        body("image").custom((value, { req }) => {
            if (!req.file) {
                throw new Error("archivo invalido");
            }
            return true
        }
        ).optional()
    ]
}

module.exports = updateCategoriaVali