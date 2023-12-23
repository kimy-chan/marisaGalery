const ModelCategory = require("../model/model.category");
const ProductModel = require("../model/model.products");

class IndexController {

  async index(req, res) {//muestra toda la plantilla de inicio
    const title = "Inicio"
    try {
      const product = await ProductModel.productDestacado();
      const categories = await ModelCategory.showCategory();

      return res.render("index", { product: product, categories: categories, title });
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }
  }

  cartCantidad(req, res) {// muestra la cantidad del carrito
    let cantidaCart;
    if (Array.isArray(req.session.idProduct)) {
      cantidaCart = req.session.idProduct;
    } else {
      cantidaCart = 0;
    }
    return res.json({ cantidaCart: cantidaCart });
  }

  portadaIndex(req, res) {//portda 
    return res.render("portada")
  }



  //---------------------------------------------------------------
  //FOOTER INFORMACION
  async infoMetodoPago(req, res) {//informacion de los metodos de pago
    const title = "Metodos de pago"
    try {
      const categories = await ModelCategory.showCategory();
      return res.render("infoMetodoPago", { title, categories });
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }




  }

  async PreguntasFrecuentes(re, res) {
    const title = "Preguntas Frecuentes"
    try {
      const categories = await ModelCategory.showCategory();
      return res.render("PreguntasFrecuentes", { title, categories });

    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }

  }
}


const indexController = new IndexController();

module.exports = indexController;
