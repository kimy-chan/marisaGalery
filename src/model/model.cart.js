
const getConecction = require("./db/db");



class CartModel {


    static async cardProduct({ productId }) {
        let conn
        try {
            conn = await getConecction()
            const sqlQueryProduct = " SELECT * FROM ViewsProduct WHERE idProduct = ?"
            const [product] = await conn.query(sqlQueryProduct, [productId])
            return product
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }


    }

}
module.exports = CartModel