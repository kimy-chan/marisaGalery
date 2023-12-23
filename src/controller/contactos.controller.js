const ModelCategory = require("../model/model.category")
class ContactoController {

    static async contacto(req, res) {
        try {
            const title = "Contactos"
            const categories = await ModelCategory.showCategory();
            return res.render("contacto", { categories: categories, title })

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        }


    }

}

module.exports = ContactoController