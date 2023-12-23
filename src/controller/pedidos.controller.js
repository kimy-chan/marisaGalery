const ModelPedido = require("../model/model.Pedidos");
const CartAux = require("../helpers/helperAuxiliarCart");
const { validationResult } = require("express-validator");
const ModelCategory = require("../model/model.category")

class PedidosController {


  static async pedido(req, res) {
    const title = "Realizar Pedido"
    const error = []
    try {
      const categories = await ModelCategory.showCategory();
      if (req.session.idProduct) {
        let product = await CartAux.getProdcut(req.session.idProduct)
        return res.render("pedidoForm", { title, products: product.productUnique, val: '', totalPrice: product.totalPrice, error: error, categories: categories })
      }
      return res.redirect("/cart")
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }

  }



  static async pedidoFinal(req, res) {
    const title = "Realizar Pedido"
    const { nombre, apellidos, celular, Ciudad, direccion } = req.body
    const recoger = req.body.recoger === 'on' ? 0 : 0;
    const entrega = req.body.entrega === 'on' ? 1 : 0;

    const orderP = {
      recoger: recoger,
      entrega: entrega
    }


    const lastName = apellidos.split(' ')
    const numeroTienda = process.env.TELEFONO_TIENDA

    const value = validationResult(req)
    if (!value.isEmpty()) {
      const error = value.array()
      const val = req.body
      if (req.session.idProduct) {
        const categories = await ModelCategory.showCategory();
        let product = await CartAux.getProdcut(req.session.idProduct)
        return res.render("pedidoForm", { title, products: product.productUnique, val: val, totalPrice: product.totalPrice, error, categories: categories })
      }
    }
    try {
      if (req.session.idProduct) {
        let product = await CartAux.getProdcut(req.session.idProduct)
        const result = await ModelPedido.Pedido({ nombre, lastName, celular, Ciudad, direccion, product, orderP })
        if (result.sqlState == '45000') {
          return res.redirect("/cart")
        } else {
          let urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroTienda}&text=Hola soy
          ${nombre}\n mi celular es ${celular}\n ciudad ${Ciudad},\n direccion ${direccion} \n realizo el pedido del los productos:
           \n Total:${product.totalPrice} \n`

          for (let produc of product.productUnique) {
            urlWhatsApp += `Producto: ${produc.nameProduct}\n Talla: ${produc.size} \n Cantidad: ${produc.cantidad} \n Precio:${produc.price}`;
          }

          urlWhatsApp = urlWhatsApp.replace("%0A", "\n")
          return res.redirect(encodeURI(urlWhatsApp));


        }

      }

      return res.redirect("/cart", { title: "Carrito" })
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }

  }

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
      return res.status(500).send("Error interno del servidor");
    }

  }

  static async stateOrder(req, res) {///actualiza a 1 para mandar a vetas
    const { idOrder } = req.params
    const state = 1
    try {
      await ModelPedido.productEntregado({ idOrder, state })
      return res.redirect("/get-order?mensaje=vender")
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }



  }
  static async deteleOrder(req, res) {

    const { idPersonOrder } = req.params
    try {
      await ModelPedido.deletePorductId({ idPersonOrder })

      return res.redirect("/get-order?mensaje=eliminar")


    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }

  }









}

module.exports = PedidosController