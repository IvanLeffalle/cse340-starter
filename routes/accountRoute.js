//Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

//route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Process the login attempt
router.post("/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

router.get("/management", utilities.handleErrors(accountController.buildAccount));

router.get("/update-account",  utilities.handleErrors(accountController.buildUpdateAccount));

router.post("/update-account",regValidate.updateAccountRules (), regValidate.checkUpdateAccountData ,  utilities.handleErrors(accountController.updateAccount));
router.post("/update-password", utilities.handleErrors(accountController.updatePassword));

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

//admin dashboard routes
router.get("/admin",utilities.handleErrors(accountController.buildAdminView))
router.get("/admin/get-accounts", utilities.handleErrors(accountController.getAccounts))

router.get("edit", utilities.handleErrors(accountController.accountBuildEditAccountt))


module.exports = router;
