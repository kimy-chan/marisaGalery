const getConecction = require("./db/db");

class ModelUser {
  static async addUser({ name, lastName, email, newPassword, role }) {
    let conn;
    const sqlQueryPerson =
      "INSERT INTO Person(firstName,lastName,motherLastName,dateRegister)VALUES(?,?,?,now())";
    const sqlQueryUser =
      "INSERT INTO User(email,password,idPerson)VALUES(?,?,?)";
    const sqlQueryRole = "INSERT INTO role(idUser,nameRole)VALUES(?,?)";
    try {
      conn = await getConecction();
      await conn.beginTransaction();
      const [person] = await conn.query(sqlQueryPerson, [
        name,
        lastName[0],
        lastName[1],
      ]);
      const [user] = await conn.query(sqlQueryUser, [
        email,
        newPassword,
        person.insertId,
      ]);
      await conn.query(sqlQueryRole, [user.insertId, role]);
      conn.commit();
      return 'success'
    } catch (error) {
      conn.rollback();
      return error;


    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

  static async getUser() {
    let conn
    const sqlUser = "SELECT * FROM VerifyUser"
    try {
      conn = await getConecction();
      const [user] = await conn.query(sqlUser)
      return user
    } catch (error) {
      return res.status(500).send("Error interno del servidor");

    } finally {
      if (conn) {
        conn.release()
      }
    }



  }

  static async deleteUser({ idPerson }) {
    let conn
    const sqlUserDelte = 'DELETE FROM Person WHERE idPerson= ?'
    try {
      conn = await getConecction();
      const [userDete] = await conn.query(sqlUserDelte, [idPerson])
      return userDete
    } catch (error) {
      return error
    } finally {
      if (conn) {
        conn.release()
      }
    }
  }

}

module.exports = ModelUser;
