function rolesUser(req, res, next) {
    const roles = req.user.nameRole
    console.log(roles);
    if (roles === 'admin' || roles === 'vendedor') {
        return next()
    }
    return res.redirect("/login")


}
module.exports = rolesUser