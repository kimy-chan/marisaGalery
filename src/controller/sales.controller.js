const ModelSales = require("../model/model.sales")

class SalesController {
  constructor() {
    this.data = []
  }


  static async getSales(req, res) {
    const title = "Ventas"
    const mensaje = req.query.mensaje
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    try {

      const sales = await ModelSales.getSales()
      return res.render("ventasPanel", {
        venta: sales,
        mensaje,
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title
      })
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }

  }
  static async deleteSales(req, res) {
    const { idSales } = req.params
    try {
      await ModelSales.deleteSales({ idSales })
      return res.redirect("/ventas?mensaje=elimanada")
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }


  }

}

module.exports = SalesController