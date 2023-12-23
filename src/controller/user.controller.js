const { validationResult } = require("express-validator");
const ModelUser = require("../model/model.user")
const bcrypt = require("bcrypt");
class UserController {

    async registerUser(req, res) {
        const title = "Añadir administradores"
        const nombreUser = req.user.firstName
        const apellidoUser = req.user.lastName
        const emailUser = req.user.email
        const rolUser = req.user.nameRole
        const result = validationResult(req)
        const { name, lastNames, email, password, role } = req.body
        const lastName = lastNames.split(' ')
        const newPassword = bcrypt.hashSync(password, 10)
        const valuesBody = req.body

        if (!result.isEmpty()) {
            return res.render("registroUserPanel", {
                errors: result.array(), valuesBody, alertMensaje: '',
                nombreUser,
                apellidoUser,
                emailUser,
                rolUser,
                title
            })
        }
        try {
            const user = await ModelUser.addUser({ name, lastName, email, newPassword, role })
            if (user.code === 'ER_DUP_ENTRY') {
                const alertMensaje = "existe"
                return res.render("registroUserPanel", {
                    errors: [], valuesBody, alertMensaje,
                    nombreUser,
                    apellidoUser,
                    emailUser,
                    rolUser,
                    title
                })
            }
            const alertMensaje = "registrado"
            return res.render("registroUserPanel", {
                errors: [], valuesBody: '', alertMensaje,
                nombreUser,
                apellidoUser,
                emailUser,
                rolUser,
                title
            })

        } catch (error) {
            return res.status(500).send("Error interno del servidor");
        }



    }

    async getUserPanel(req, res) {//trae los usuarios para e panel
        const title = "Administradores"
        const nombreUser = req.user.firstName
        const apellidoUser = req.user.lastName
        const emailUser = req.user.email
        const rolUser = req.user.nameRole

        const mensaje = req.query.mensaje
        try {

            const user = await ModelUser.getUser()
            return res.render("usuarios", {
                user, mensaje,
                nombreUser,
                apellidoUser,
                emailUser,
                rolUser,
                title
            })
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        }

    }
    getUserPanelForm(req, res) {//panel para registrar usuarios formulario
        const title = "Añadir Administradores"
        const nombreUser = req.user.firstName
        const apellidoUser = req.user.lastName
        const emailUser = req.user.email
        const rolUser = req.user.nameRole
        return res.render("registroUserPanel", {
            valuesBody: '', errors: [], alertMensaje: '',
            nombreUser,
            apellidoUser,
            emailUser,
            rolUser,
            title

        })
    }

    async deleteUserPanel(req, res) {//borrar usuario del panel
        const { idPerson } = req.params
        try {
            const delteUser = await ModelUser.deleteUser({ idPerson })
            if (delteUser.affectedRows == 1) {
                return res.redirect("/user?mensaje=borrado")
            }
            return res.redirect("/user")
        } catch (error) {
            return res.status(500).send("Error interno del servidor");

        }

    }

}










const userController = new UserController()

module.exports = userController