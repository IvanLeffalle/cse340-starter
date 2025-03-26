const utilities = require ("../utilities")
const accountCont = {}

accountCont.buildLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const form = await utilities.loginForm()
    res.render("./account/login", {
      title: "Login",
      nav,
      form,
    })
  }
  
  module.exports = accountCont