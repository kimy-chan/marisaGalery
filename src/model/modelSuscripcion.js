const getConecction = require("./db/db");


class ModelSuscripcion {

    static async addSuscripcion({ nombresCompletos, email, texto }) {
        let conn
        const sqlPerson = "INSERT INTO Person(firstName,lastName ,motherLastName, dateRegister)values(?,?,?,now())"
        const sqlSuscripcion = "INSERT INTO Suscriptor(Email, textArea, idPerson)Values(?,?,?)"
        try {
            conn = await getConecction()
            conn.beginTransaction()
            const [person] = await conn.query(sqlPerson, [nombresCompletos[0], nombresCompletos[1], nombresCompletos[2]])
            await conn.query(sqlSuscripcion, [email, texto, person.insertId])
            conn.commit()
            return 'success'

        } catch (error) {
            conn.rollback
            return error

        } finally {
            if (conn) {
                conn.release()
            }
        }
    }


    static async getSuscriptores() {
        let conn
        const sqlSuscriptores = "SELECT * FROM Suscriptos "
        try {
            conn = await getConecction()
            const [suscriptores] = await conn.query(sqlSuscriptores)
            return suscriptores

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }

    static async deleteSuscriptor({ idPerson }) {
        let conn
        try {
            conn = await getConecction()
            const deleteSuscriptor = "DELETE FROM Person where idPerson=?"
            const resultDelete = await conn.query(deleteSuscriptor, [idPerson])
            return resultDelete
        } catch (error) {
            return error

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }

}

module.exports = ModelSuscripcion