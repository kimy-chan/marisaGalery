const ModelPedido = require("../model/model.Pedidos");

class PedidosController {
  static async getAllOrder(req, res) {
    const title = "Pedidos"
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const mensaje = req.query.mensaje
    const state = 0

    try {
      if (mensaje) {
        const order = await ModelPedido.getAllOrder({ state })
        return res.render("pedidoPanel", {
          pedido: order,
          mensaje: mensaje,
          nombreUser,
          apellidoUser,
          emailUser,
          rolUser,
          title

        })
      }
      const order = await ModelPedido.getAllOrder({ state })

      return res.render("pedidoPanel", {
        pedido: order,
        mensaje: '',
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title
      })
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }

  }

  static async stateOrder(req, res) {///actualiza a 1 para mandar a vetas
    const { idOrder } = req.params
    const state = 1
    try {
      await ModelPedido.productEntregado({ idOrder, state })
      return res.redirect("/get-order?mensaje=vender")
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });
    }



  }
  static async deteleOrder(req, res) {

    const { idPersonOrder } = req.params
    try {
      await ModelPedido.deletePorductId({ idPersonOrder })

      return res.redirect("/get-order?mensaje=eliminar")


    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor" });

    }

  }









}

module.exports = PedidosController