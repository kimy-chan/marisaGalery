const { validationResult } = require("express-validator");
const ModelAuth = require("../model/model.auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthController {

  static async login(req, res) {
    const result = validationResult(req);//muestra todos los errores de los resultados

    if (!result.isEmpty()) {//verifica si existe o no errores
      return res.render("login", { errors: result.array(), alertMsg: "" });
    }
    try {
      const { email, password } = req.body;
      const dataUser = await ModelAuth.login({ email });
      if (dataUser.length === 0) {
        const mgsCuenta = "La cuenta no existe";
        return res.render("login", { errors: [], alertMsg: mgsCuenta });
      }
      if (
        email === dataUser[0].email &&
        (await bcrypt.compare(password, dataUser[0].password))
      ) {
        const token = jwt.sign(
          { idUser: dataUser[0].idUser },
          process.env.JWT_SECRET
        )
        res.cookie('jwt', token, {
          httpOnly: true,
          sameSite: "strict",
          maxAge: 60 * 60 * 1000
        })
        return res.redirect("/administration-panel")


      } else {
        const msgPassword = "Contraseña incorrecta";
        return res.render("login", { errors: [], alertMsg: msgPassword });
      }
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }
  }

  static formLogin(req, res) {
    return res.render("login", { errors: [], alertMsg: "" });
  }

  static logout(req, res) {
    res.clearCookie('jwt')
    return res.redirect("/login")

  }
}

module.exports = AuthController;
