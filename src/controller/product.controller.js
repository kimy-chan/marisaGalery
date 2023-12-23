
const { validationResult } = require("express-validator");
const ModelProduct = require("../model/model.products")
const ModelCategory = require("../model/model.category")
const cloudinary = require("cloudinary")
const path = require("path")

const fs = require("fs");


class ProductController {

  constructor() {
    this.data = []
    this.productPanel = []
    this.newProdcut = false
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET
    })

  }
  async formProduct(req, res) {
    try {
      const title = 'Añadir producto'
      const nombreUser = req.user.firstName
      const apellidoUser = req.user.lastName
      const emailUser = req.user.email
      const rolUser = req.user.nameRole
      let values = []
      let error = []
      const mensaje = req.query.mensaje === 'true';
      const categories = await ModelCategory.showCategory()
      return res.render("formProductPanel", {
        values, error,
        categories: categories,
        productoAgregado: mensaje,
        categories: categories,
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

  async addProduct(req, res) {
    const title = 'Añadir producto'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const img = req.files
    let pathImgCloud = []


    const result = validationResult(req)
    try {
      if (!result.isEmpty()) {
        const values = req.body
        const categories = await ModelCategory.showCategory()
        return res.render("formProductPanel",
          {
            error: result.array(),
            values, categories: categories,
            productoAgregado: false,
            nombreUser,
            apellidoUser,
            emailUser,
            rolUser,
            title

          })
      }
      const { nombre, cantidad, colores, descripcion, tallas, categorias, precio } = req.body
      const destacado = req.body.destacado === '1' ? 1 : 0;
      for (let imgCloud of img) {
        const pathCloud = await cloudinary.v2.uploader.upload(imgCloud.path)
        let infoImg = {}
        infoImg.urlImg = pathCloud.secure_url
        infoImg.idImg = pathCloud.public_id
        pathImgCloud.push(infoImg)
      }
      await ModelProduct.addPorduct({ nombre, descripcion, cantidad, precio, colores, tallas, pathImgCloud, categorias, destacado })
      return res.redirect("/add-product?mensaje=true")

    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    } finally {
      for (let i of img) {
        if (fs.existsSync(path.join(__dirname + `../../public/upload/${i.filename}`))) {
          fs.unlinkSync(path.join(__dirname + `../../public/upload/${i.filename}`))
        }
      }

    }
  }


  //---------------------------------------------------





  async descriptionProduct(req, res) {
    const title = "Descripcion"
    const { idProduct } = req.params
    try {
      const categories = await ModelCategory.showCategory()
      const product = await ModelProduct.descriptionProduct({ idProduct })
      return res.render("descriptionProduct", { product: product, categories: categories, title })
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }
  }

  //-------panel

  async getProductAllPanel(req, res) {
    const title = 'Productos'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const mensaje = req.query.mensaje === 'true';
    const mensajeDelete = req.query.mensaje;
    try {
      let result = [];
      const product = await ModelProduct.getAllProduct()
      return res.render("productPanel", {
        error: result, values: '',
        product: product,
        mensaje: mensaje,
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title,
        mensajeDelete
      });

    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }
  }

  async deleteProduct(req, res) {
    try {
      const { idProduct } = req.params
      const dataImg = await ModelProduct.deleteProduct({ idProduct })
      if (dataImg === 1451) {
        return res.redirect("/products-panel?mensaje=true")

      }

      if (dataImg) {
        for (let data of dataImg) {
          await cloudinary.v2.uploader.destroy(data.imagenId)
        }
      }
      return res.redirect("/products-panel?mensaje=delete")
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }


  }

  async formUpdateProdcut(req, res) {
    const title = 'Actualizar producto'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const { idProduct } = req.params
    const mensaje = req.query.mensaje

    let values = []
    const categoriaP = []
    let dataCategoria = {}

    try {
      const product = await ModelProduct.getAllProductId({ idProduct })
      const categories = await ModelCategory.showCategory()
      for (let categoria of categories) {
        if (categoria.idCategory == product.productos[0].idCategory) {
          dataCategoria.idCategory = categoria.idCategory
          dataCategoria.nombreCategoria = categoria.nameCategory
          categoriaP.push(dataCategoria)
        }

      }
      return res.render("formProductPanelUpdate", {
        product: product.productos,
        img: product.dataImgPro, values, error: [],
        categories: categories,
        categoriaP: categoriaP,
        mensaje,
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title,
        fileError: ''


      })
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }


  }
  async updateProduct(req, res) { // actuliza el producto
    const title = 'Actualizar producto'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const val = validationResult(req)
    const categoriaP = []
    let pathImgCloud = []
    let dataCategoria = {}
    const { idProduct } = req.params
    const img = req.files
    try {
      const product = await ModelProduct.getAllProductId({ idProduct })


      if (req.fileError || !val.isEmpty()) {
        const categories = await ModelCategory.showCategory()
        for (let categoria of categories) {
          if (categoria.idCategory == product.productos[0].idCategory) {
            dataCategoria.idCategory = categoria.idCategory
            dataCategoria.nombreCategoria = categoria.nameCategory
            categoriaP.push(dataCategoria)
          }

        }
        return res.render("formProductPanelUpdate", {
          error: val.array(), product: product.productos, img: product.dataImgPro,
          categories, categoriaP, nombreUser, apellidoUser, emailUser, rolUser, mensaje: '',
          title,
          fileError: req.fileError
        })

      }
      const { nombre, cantidad, colores, descripcion, tallas, categorias, precio } = req.body
      const destacado = req.body.destacado === '1' ? 1 : 0
      if (img.length > 0) { // añade la imagen nueva
        let oldImgI = product.dataImgPro.map(imagen => imagen.imagenId)//mapea todo los id de imagenes
        const newImagePublicIds = []; //id de las imagenes nuevas
        for (let i of img) {//añade las nuevas images 
          const cloudImg = await cloudinary.v2.uploader.upload(i.path)
          const dataImge = {}
          dataImge.urlImage = cloudImg.secure_url
          dataImge.idImg = cloudImg.public_id
          pathImgCloud.push(dataImge)
          newImagePublicIds.push(cloudImg.public_id)
        }
        let imgDelete = oldImgI.filter(id => !newImagePublicIds.includes(id))//borrar las imagenes remplazadas
        await imgDelete.map(id => cloudinary.v2.uploader.destroy(id));//borra los images 
        await ModelProduct.updateImage({ pathImgCloud, idProduct })
      }
      await ModelProduct.updateProduct({ nombre, descripcion, cantidad, precio, colores, tallas, categorias, destacado, idProduct })
      return res.redirect(`/update-product/${idProduct}?mensaje=true`)

    } catch (error) {
      return res.status(500).send("Error interno del servidor" + error);
    } finally {
      for (let i of img) {
        if (fs.existsSync(path.join(__dirname + `../../public/upload/${i.filename}`))) {//borra la imagenes del servidor
          fs.unlinkSync(path.join(__dirname + `../../public/upload/${i.filename}`))
        }
      }


    }

  }


}

const productController = new ProductController()
module.exports = productController