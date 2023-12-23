
const getConecction = require("./db/db")


class ModelCategory {


    static async addCategory(nameCategory, image, idImg) {
        let conn;
        try {
            conn = await getConecction()
            const sqlQueryCategory = "INSERT INTO Category(nameCategory,image,imageId)values(?,?,?)"
            const [result] = await conn.query(sqlQueryCategory, [nameCategory, image, idImg])
            return result

        } catch (error) {
            return error
        } finally {
            if (conn) {
                conn.release()
            }
        }

    }

    static async showCategory() {
        let conn
        try {
            conn = await getConecction()
            const sqlQueryCategory = "SELECT * FROM Category"
            const [categories] = await conn.query(sqlQueryCategory)
            return categories

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }

    static async deleteCategory(idCategory) {
        let conn
        const sqlQueryCategoryDelete = "DELETE FROM Category WHERE idCategory=?"
        try {
            conn = await getConecction()
            await conn.query(sqlQueryCategoryDelete, [idCategory])
            return

        } catch (error) {
            return error.code

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }
    static async getCategoryId(idCategory) {
        let conn
        const sqlQueryCategoryDelete = "SELECT *  FROM Category WHERE idCategory=?"
        try {
            conn = await getConecction()
            const [categoria] = await conn.query(sqlQueryCategoryDelete, [idCategory])
            return categoria

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }
    static async updateCategory({ categoria, idCategory }) {
        let conn
        const sqlQueryCategoryDelete = "UPDATE Category SET nameCategory=? WHERE idCategory=?"
        try {
            conn = await getConecction()
            await conn.query(sqlQueryCategoryDelete, [categoria, idCategory])
            return


        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }
    static async updateCategoryImage({ idCategory, image, idImg }) {
        let conn
        const sqlQueryCategoryDelete = "UPDATE Category SET image=?, imageId=? WHERE idCategory=?"
        try {
            conn = await getConecction()
            await conn.query(sqlQueryCategoryDelete, [image, idImg, idCategory])
            return

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }





}

module.exports = ModelCategory