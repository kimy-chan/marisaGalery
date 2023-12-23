const getConecction = require("./db/db");
class ModelProduct {


  static async descriptionProduct({ idProduct }) {
    let conn;
    try {
      conn = await getConecction();

      const sqlQuery =
        "select  Product.idProduct, product.nameProduct , Product.description, Product.color, Product.size, Product.price, ProductDate.image  from Product inner join ProductDate on Product.idProduct = ProductDate.idProduct where Product.idProduct=?";
      const [product] = await conn.query(sqlQuery, [idProduct]);
      return product;
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  static async productDestacado() {
    let conn;
    try {
      conn = await getConecction();
      const sqlQuery = "SELECT * FROM Outstanding where amount > 0";

      const [product] = await conn.query(sqlQuery);
      return product;
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  static async getProductCategory({ nameProduct }) {
    let conn;
    const sqlQueryProduct =
      "SELECT *  FROM ViewsProduct where nameCategory = ?";
    const sqlQueryCategory = "SELECT * FROM category";
    try {
      conn = await getConecction();
      const [category] = await conn.query(sqlQueryCategory);
      const [product] = await conn.query(sqlQueryProduct, [nameProduct]);
      const data = { category: category, product: product };
      return data;
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    } finally {
      if (conn) {
        conn.release();
      }
    }
  }
  static async addPorduct({ nombre, descripcion, cantidad, precio, colores, tallas, pathImgCloud, categorias, destacado }) {
    let conn
    const sqlQueryPorduct = "INSERT INTO Product(nameProduct,description, amount, price,date,color,size,outstanding, idCategory)VALUES(?,?,?,?,now(),?,?,?,?)"
    const sqlQueryProductDate = "INSERT INTO ProductDate(image,imagenId, idProduct)values(?,?,?)"
    try {
      conn = await getConecction();
      await conn.beginTransaction()

      const [product] = await conn.query(sqlQueryPorduct, [nombre, descripcion, cantidad, precio, colores, tallas, destacado, categorias])
      for (let urlImg of pathImgCloud) {
        await conn.query(sqlQueryProductDate, [urlImg.urlImg, urlImg.idImg, product.insertId])
      }
      await conn.commit()

    } catch (error) {

      conn.rollback()
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }



  }

  static async getAllProduct() {
    let conn;
    const sqlQueryPorductAll = "SELECT * FROM ViewsProduct"
    try {
      conn = await getConecction()
      const [product] = await conn.query(sqlQueryPorductAll)
      return product


    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  static async deleteProduct({ idProduct }) {

    const sqlDElete = "DELETE FROM Product WHERE idProduct=?"
    const sqlPorductImg = "SELECT imagenId FROM ProductDate WHERE idProduct=? "
    let conn
    try {
      conn = await getConecction()
      const [imgDate] = await conn.query(sqlPorductImg, [idProduct])
      await conn.query(sqlDElete, [idProduct])
      return imgDate

    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return 1451
      }


    } finally {
      if (conn) {
        conn.release()
      }
    }

  }
  static async getAllProductId({ idProduct }) {
    let conn;
    const sqlQueryPorductAll = "SELECT * FROM Product WHERE idProduct=?"
    const sqlQueryProductDate = "SELECT * FROM ProductDate WHERE idProduct =?"
    try {
      conn = await getConecction()
      const [product] = await conn.query(sqlQueryPorductAll, [idProduct])
      const [dataImg] = await conn.query(sqlQueryProductDate, [product[0].idProduct])
      const data = {
        productos: product,
        dataImgPro: dataImg
      }
      return data


    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  static async updateProduct({ nombre, descripcion, cantidad, precio, colores, tallas, pathImgCloud, categorias, destacado, idProduct }) {
    let conn
    const sqlQueryPorduct = "UPDATE  Product SET nameProduct=?,description=?, amount=?, price=?,color=?,size=?,outstanding=?, idCategory=? WHERE idProduct=?"

    try {
      conn = await getConecction()

      await conn.query(sqlQueryPorduct, [nombre, descripcion, cantidad, precio, colores, tallas, destacado, categorias, idProduct])
      return

    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }

  }
  static async updateImage({ pathImgCloud, idProduct }) {
    let conn
    const sqlQueryProductDate = "UPDATE ProductDate SET image=?,imagenId=? WHERE idProduct=? and idProductDate=?"
    const sqlProductdata = "SELECT idProductDate FROM ProductDate WHERE idProduct =?"
    try {
      conn = await getConecction()
      const [data] = await conn.query(sqlProductdata, [idProduct])
      const idImg = data.map(id => id.idProductDate)
      for (let index = 0; index < pathImgCloud.length; index++) {
        const image = pathImgCloud[index]
        const idimages = idImg[index]
        await conn.query(sqlQueryProductDate, [image.urlImage, image.idImg, idProduct, idimages])
      }
      return
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    } finally {
      if (conn) {
        conn.release()
      }
    }

  }

  static async getImg({ idProduct }) {
    const sqlPorductImg = "SELECT imagenId FROM ProductDate WHERE idProduct=? "
    let conn
    try {
      conn = await getConecction()
      const [idCloudinary] = await conn.query(sqlPorductImg, [idProduct])
      return idCloudinary

    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }
  }





}

module.exports = ModelProduct;
