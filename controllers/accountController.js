const utilities = require("../utilities");
const accountCont = {};
const accountModel = require("../models/account-model");

accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  // const form = await utilities.loginForm();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
    // form,
  });
};

accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );
  console.log("datos:", regResult);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    // const form = await utilities.loginForm();
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      // form,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");

    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
};

module.exports = accountCont;
