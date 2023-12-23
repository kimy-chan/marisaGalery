const getConecction = require("./db/db")
class ModelAuth {
    static async login({ email }) {
        let conn;
        try {
            conn = await getConecction()
            const query = "SELECT * FROM VerifyUser where email=?"
            const [result] = await conn.query(query, [email]);
            return result
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }
    }

    static async VerificaUsuarioRol(idUser) {
        let conn;
        try {
            conn = await getConecction()
            const query = "SELECT * FROM VerifyUser where idUser=?"
            const [result] = await conn.query(query, [idUser]);
            return result
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }
}

module.exports = ModelAuth