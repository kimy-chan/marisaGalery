const { body } = require("express-validator");
function categoryValidator() {
    return [
        body("categoria", "Categoria invalido").matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/),
        body("image").custom((value, { req }) => {
            if (!req.file) {
                throw new Error("archivo invalido")
            }
            return true
        }

        )
    ]
}

module.exports = categoryValidator