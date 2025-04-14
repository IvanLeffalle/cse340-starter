const utilities = require("../utilities");
const accountCont = {};
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

accountCont.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res); // const form = await utilities.loginForm();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
    header,
    // form,
  });
};

accountCont.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
    header,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("./account/register", {
      title: "Registration",
      nav,
      header,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    // const form = await utilities.loginForm();

    res.status(201).render("account/login", {
      title: "Login",
      nav,
      header,
      errors: null,

      // form,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");

    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      header,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      header,
      errors: null,
      account_email,
      message,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("./account/login", {
        title: "Login",
        nav,
        header,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

accountCont.buildAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  let accountData = res.locals.accountData;
  let name = accountData.account_firstname;
  const header = await utilities.getHeader(req, res);
  res.render("./account/account", {
    title: `Welcome ${name}`,
    message: "You're logged in",
    nav,
    header,
    errors: null,
  });
};

accountCont.buildUpdateAccount = async function (req, res, next) {
  let nav = await utilities.getNav();
  let accountData = res.locals.accountData;
  const header = await utilities.getHeader(req, res);
  res.render("./account/updateAccount", {
    title: `Welcome`,
    message: "You're logged in",
    nav,
    header,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  });
};

/* ****************************************
 *  request to update account
 * ************************************ */
accountCont.updateAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    parseInt(account_id)
  );

  if (updateResult) {
    console.log("the info has been u´dated");
    req.flash(
      "notice",
      `Congratulations, you\'re updated ${account_firstname}. Please sign in.`
    );
    res.clearCookie("jwt");
    res.locals.loggedin = 0;
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
      errors: null,
      header,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/updateAccount", {
      title: "Update Account",
      nav,
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
      errors: null,
      header,
    });
  }
};
/* ****************************************
 *  request to update account as Admin
 * ************************************ */
accountCont.editAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    account_id,
  } = req.body;

  const updateResult = await accountModel.editAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    parseInt(account_id)
  );

  if (updateResult) {
    console.log("the info has been u´dated");
    req.flash(
      "notice",
      `Congratulations, you\'ve updated ${account_firstname}.`
    );
    res.locals.loggedin = 0;
    res.status(201).render("account/admin", {
      title: "Admin dashboard",
      nav,
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
      errors: null,
      header,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/updateAccount", {
      title: "Update Account",
      nav,
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
      errors: null,
      header,
    });
  }
};
/* ****************************************
 *  request to update password account
 * ************************************ */
accountCont.updatePassword = async function (req, res) {
  const { account_password, account_id } = req.body;
  const hashedPassword = await bcrypt.hash(account_password, 10);
  const updateResult = await accountModel.updateAccountPassword(
    hashedPassword,
    parseInt(account_id)
  );
  if (updateResult) {
    req.flash("notice", "Password updated successfully. Please sign in.");
    res.clearCookie("jwt");
    res.locals.loggedin = 0;
    res.status(201).redirect("/account/login");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/updateAccount", {
      title: "Update Account",
      nav,
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
      errors: null,
      header,
    });
  }
};
/* ****************************************
 *  Build Admin Dashboard
 * ************************************ */
accountCont.buildAdminView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  let accountData = res.locals.accountData;
  let name = accountData.account_firstname;
  res.render("./account/admin", {
    title: `Welcome ${name}`,
    message: "You're logged in",
    nav,
    header,
    errors: null,
  });
};

/* ***************************
 *  Return account As JSON
 * ************************** */

accountCont.getAccounts = async function (req, res) {
  try {
    const result = await accountModel.getAllAccounts();
    console.log("data", result);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error getting accounts" });
  }
};
/* ***************************
 *  Edit account
 * ************************** */
accountCont.buildEditAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const acc_id = parseInt(req.params.accountId);
  const header = await utilities.getHeader(req, res);
  const itemData = await accountModel.getAccountById(acc_id);
  const item = itemData[0];
  console.log("account data", item);
  res.render("./account/edit-account", {
    title: `Edit account ${acc_id}`,
    nav,
    header,
    errors: null,
    account_firstname: item.account_firstname,
    account_lastname: item.account_lastname,
    account_email: item.account_email,
    account_type: item.account_type,
    account_id: acc_id,
  });
};

/* ***************************
 *  Delete Account View
 * ************************** */
accountCont.buildDeleteAccount = async function (req, res, next) {
  const acc_id = parseInt(req.params.acc_id);
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const itemData = await accountModel.getAccountById(acc_id);
  const item = itemData[0];
  console.log("data account:", itemData);
  res.render("./account/delete-account", {
    title: "Delete Account",
    nav,
    header,
    errors: null,
    account_id: acc_id,
    account_firstname: item.account_firstname,
    account_lastname: item.account_lastname,
    account_email: item.account_email,
    account_type: item.account_type,
  });
};
/* ***************************
 *  Delete account Data
 * ************************** */
accountCont.deleteAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const header = await utilities.getHeader(req, res);
  const { account_id } = req.body;
  try {
    const deleteAcc = await accountModel.deleteAccount(account_id);
    if (deleteAcc.rowCount > 0) {
      req.flash(
        "notice",
        `The account with account Id: ${account_id}, was successfully deleted`
      );
    } else {
      req.flash("notice", "Sorry, the delete failed");
    }
    res.redirect("./admin");
  } catch (error) {
    console.error("Error deleting account", error);
    req.flash("notice", "An error occurred while deleting the account.");
    res.status(500).render(".account/admin", {
      title: "delete Account",
      nav,
      errors: null,
      header,
      ...req.body,
    });
  }
};

/* ****************************************
 *  Process to logout
 * ************************************ */
accountCont.accountLogout = async function (req, res) {
  req.flash("notice", "You have been logged out.");
  res.clearCookie("jwt");
  return res.redirect("/");
};

module.exports = accountCont;
