const ModelPedido = require("../model/model.Pedidos")
const ModelCategory = require("../model/model.category")
const ModelProduct = require("../model/model.products")
const ModelSales = require("../model/model.sales")
const ModelUser = require("../model/model.user")
const ModelSuscripcion = require("../model/modelSuscripcion")

class AdministrationController {
    static async Administration(req, res) {
        try {
            const title = "Dashboard"
            const nombreUser = req.user.firstName
            const apellidoUser = req.user.lastName
            const emailUser = req.user.email
            const rolUser = req.user.nameRole
            //  const infoUser = req.user muestra la informacion de los roles
            const state = 0 //estado 0 para los pedidos
            const products = await ModelProduct.getAllProduct()
            const categories = await ModelCategory.showCategory()
            const sales = await ModelSales.getSales()
            const order = await ModelPedido.getAllOrder({ state })
            const suscriptores = await ModelSuscripcion.getSuscriptores()
            const user = await ModelUser.getUser()
            return res.render("adminstracionPanel", {
                products: products.length, categories: categories.length,
                sales: sales.length,
                order: order.length,
                user: user.length,
                suscriptores: suscriptores.length,
                nombreUser,
                emailUser,
                apellidoUser,
                rolUser,
                title
            })
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        }

    }

}
module.exports = AdministrationController