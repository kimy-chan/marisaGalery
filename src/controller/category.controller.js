const ModelProduct = require("../model/model.products");
const ModelCategory = require("../model/model.category")
const cloudinary = require("cloudinary")
const path = require("path")
const fs = require("fs");
const { validationResult } = require('express-validator');





class CategoryController {



  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET
    });

  }



  async showProduct(req, res) {// muestra las categorias en las paginas del clientes
    const title = "Productos"
    try {
      let { nameProduct } = req.params;
      const product = await ModelProduct.getProductCategory({ nameProduct });
      return res.render("category", {
        product: product.product,
        category: product.category,
        categories: product.category,
        title
      });
    } catch (error) {
      return res.status(500).send("Error interno del servidor", error);

    }
  }

  async categoryPanel(req, res) {
    const title = 'Categorias'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const categoriaMsg = req.query.CategoriAdd //mensaje de categoria añadida
    const categoriaDeleteMsg = req.query.mensajeDelete //mensaje de categoria borrada
    const categoriaDuplicada = req.query.CategoriaDuplicada// categoria duplicada
    try {
      const categories = await ModelCategory.showCategory()
      return res.render("categoriasPanel", {
        categories: categories,
        mensaje: '', valuesbody: '', error: [], categoriaMsg, categoriaDeleteMsg,
        categoriaDuplicada,
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title

      })
    } catch (error) {
      return res.status(500).send("Error interno del servidor", error);


    }
  }

  async addCategory(req, res) {
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const title = 'Categorias'
    const result = validationResult(req)

    const { categoria } = req.body
    const image = req.file

    try {
      if (!result.isEmpty()) {
        const valuesbody = req.body
        const categories = await ModelCategory.showCategory()
        return res.render("categoriasPanel", {
          categories: categories, mensaje: '',
          valuesbody, error: result.array(), categoriaMsg: '', categoriaDeleteMsg: '',
          categoriaDuplicada: '',
          title,
          nombreUser,
          rolUser,
          apellidoUser,
          emailUser
        })
      }

      const img = await cloudinary.v2.uploader.upload(image.path)
      const resultSql = await ModelCategory.addCategory(categoria, img.secure_url, img.public_id)
      if (resultSql.code === 'ER_DUP_ENTRY') {
        return res.redirect("/category-panel?CategoriaDuplicada=true")
      }
      return res.redirect("/category-panel?CategoriAdd=true")
    } catch (error) {
      return res.status(500).send("Error interno del servidor", error);
    } finally {
      if (image) {
        if (fs.existsSync(path.join(__dirname + `../../public/upload/${image.filename}`))) {
          fs.unlinkSync(path.join(__dirname + `../../public/upload/${image.filename}`))

        }

      }


    }
  }

  async deleteCategory(req, res) {
    const title = 'Categorias'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const { idCategory, idImagen } = req.params
    try {
      const mensajesql = await ModelCategory.deleteCategory(idCategory)
      if (mensajesql) {
        const mensaje = "Hay productos en las categorias"
        const categories = await ModelCategory.showCategory()
        return res.render("categoriasPanel", {
          categories: categories, mensaje: mensaje,
          valuesbody: '', error: [], categoriaMsg: '', categoriaDeleteMsg: '',
          categoriaDuplicada: '',
          nombreUser,
          apellidoUser,
          emailUser,
          rolUser,
          title
        })
      }
      await cloudinary.v2.uploader.destroy(idImagen)
      return res.redirect("/category-panel?mensajeDelete=true")
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }

  }
  async updateCategoryForm(req, res) {
    const title = 'Actulizar categoria'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const { idCategory } = req.params
    const mensaje = req.query.mensaje
    try {
      const categoriasId = await ModelCategory.getCategoryId(idCategory)
      return res.render("updateCategoria", {
        categoriasId: categoriasId,
        mensaje,
        nombreUser,
        apellidoUser,
        emailUser,
        rolUser,
        title,
        error: [],
        fileError: ''
      })
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    }


  }
  async updateCategory(req, res) {
    const title = 'Actulizar categoria'
    const nombreUser = req.user.firstName
    const apellidoUser = req.user.lastName
    const emailUser = req.user.email
    const rolUser = req.user.nameRole
    const { idCategory } = req.params
    const { categoria } = req.body
    const imageM = req.file
    const val = validationResult(req)

    try {
      const categoriasId = await ModelCategory.getCategoryId(idCategory)

      if (req.fileError) {
        return res.render("updateCategoria", {
          categoriasId: categoriasId,
          title,
          nombreUser,
          apellidoUser,
          emailUser,
          rolUser,
          mensaje: '',
          error: [],
          fileError: req.fileError
        })

      }

      if (!val.isEmpty()) {

        return res.render("updateCategoria", {
          categoriasId: categoriasId,
          title,
          nombreUser,
          apellidoUser,
          emailUser,
          rolUser,
          mensaje: '',
          error: val.array()
        })
      }
      if (typeof imageM === 'object') {
        const imgcloud = await cloudinary.v2.uploader.upload(imageM.path)
        const image = imgcloud.secure_url
        const idImg = imgcloud.public_id
        await ModelCategory.updateCategoryImage({ idCategory, image, idImg })
        await categoriasId.map(imagen => cloudinary.v2.uploader.destroy(imagen.imageId))//borra la imagen antigua
        if (fs.existsSync(path.join(__dirname + `../../public/upload/${imageM.filename}`))) {//borra la imagen del servidor
          fs.unlinkSync(path.join(__dirname + `../../public/upload/${imageM.filename}`))

        }

      }
      await ModelCategory.updateCategory({ categoria, idCategory })
      return res.redirect(`/update-category/${idCategory}?mensaje=true`)



    } catch (error) {

      return res.status(500).send("Error interno del servidor");

    }

  }






}


const categoryController = new CategoryController()
module.exports = categoryController
