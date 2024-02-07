const ModelCategory = require("../model/model.category")

class NosotrosController {

    static async nosotros(req, res) {
        try {
            const title = "Nosotros"
            ModelCategory
            const categories = await ModelCategory.showCategory();
            return res.render("nosotros", { categories: categories, title })


        } catch (error) {
            returnres.status(500).json({ message: "Error interno del servidor" });
        }

    }

}

module.exports = NosotrosController