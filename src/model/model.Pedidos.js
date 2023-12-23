const getConecction = require("./db/db")

class ModelPedido {


    static async Pedido({ nombre, lastName, celular, Ciudad, direccion, product, orderP }) {

        let conn
        const sqlPerson = "INSERT INTO Person(firstName, lastName, motherLastName,  dateRegister)VALUES(?,?,?,now())"
        const sqlContac = "INSERT INTO Contact(cell, city, address, idPerson) values(?,?,?,?)"
        const sqlOrderCustomer = "INSERT INTO OrderCustomer(idPerson, stateOrder ,dateOrderHour)values(?,?,now())"
        const sqlProductDetail = "INSERT INTO ProductDetail(idProduct, idOrder, amount)values(?,?,?)"
        try {
            conn = await getConecction()
            await conn.beginTransaction()

            const [person] = await conn.query(sqlPerson, [nombre, lastName[0], lastName[1]])
            await conn.query(sqlContac, [celular, Ciudad, direccion, person.insertId])
            const [order] = await conn.query(sqlOrderCustomer, [person.insertId, orderP.entrega])

            for (let products of product.productUnique) {

                await conn.query(sqlProductDetail, [products.idProduct, order.insertId, products.cantidad])

            }
            conn.commit()
            return 'success'

        } catch (error) {
            conn.rollback()
            return error

        } finally {
            if (conn) {
                conn.release()
            }
        }

    }

    static async getAllOrder({ state }) {
        let conn
        const sqlOrder = "SELECT * FROM CustomerOrder WHERE state = ?"
        try {
            conn = await getConecction()
            const [order] = await conn.query(sqlOrder, [state])
            return order

        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }

        }
    }

    static async productEntregado({ idOrder, state }) {
        let conn
        const sqlOrderUdate = "UPDATE OrderCustomer  SET state = ? WHERE idOrder=?"
        try {
            conn = await getConecction()
            await conn.query(sqlOrderUdate, [state, idOrder])
            return
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        } finally {
            if (conn) {
                conn.release()
            }
        }
    }

    static async deletePorductId({ idPersonOrder }) {
        let conn
        const sqlQueryPerOrde = "DELETE FROM Person WHERE idPerson = ?"
        try {
            conn = await getConecction()
            await conn.query(sqlQueryPerOrde, [idPersonOrder])
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
module.exports = ModelPedido