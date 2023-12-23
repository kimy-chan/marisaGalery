const mysql = require("mysql2/promise")
require("dotenv").config()


const pool = mysql.createPool({
    database:process.env.DB_DATABASE,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.BD_PASSWORD,
    port:process.env.DB_PORT,
    connectionLimit:20,
    waitForConnections:true
    
})

async function  getConecction(){
    try {
        const connection = await pool.getConnection()
        console.log("conectada a la base de datos")
        return connection
    } catch (error) {
        console.log("error en la conexion a la base de datos \n", error)
        throw error
    }

}

module.exports=getConecction