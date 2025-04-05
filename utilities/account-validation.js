const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model");
const classificationModel = require("../models/inventory-model");
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */

validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;

  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z]+$/)
      .withMessage(
        "The classification name cannot contain spaces or special characters."
      ),
  ];
};

validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
  }

  next();
};

validate.vehicleRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .isInt()
      .withMessage("Classification ID is required and must be an integer."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid make (at least 2 characters)."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid model (at least 2 characters)."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required."),

    body("inv_image").trim().notEmpty().withMessage("Image URL is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail URL is required."),

    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number greater than or equal to 0."),

    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1886, max: new Date().getFullYear() })
      .withMessage("Please provide a valid year."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a valid number greater than or equal to 0."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
  ];
};

validate.checkVehicleData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let dropdown = await utilities.buildClassificationList();
    return res.render("./inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      dropdown,
      errors,
      ...req.body,
    });
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  let { inv_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList();
    return res.render("./inventory/edit-inventory", {
      title: "Edit Inventory",
      nav,
      classificationSelect,
      errors,
      inv_id,
      ...req.body,
    });
  }
  next();
};


//login validation
validate.loginRules = () => {
  return [
    // Email must be valid and not empty
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    // Password must be at least 12 characters, contain at least one uppercase letter, one number, and one special character
    body("account_password")
      .trim()
      .notEmpty()
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)
      .withMessage(
        "Password must be at least 12 characters long, include at least 1 uppercase letter, 1 number, and 1 special character."
      ),
  ];
};

validate.checkLoginData = async (req, res, next) => {
  let errors = validationResult(req);
    const header = await utilities.getHeader(req, res);  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("./account/account", {
      title: "Welcome!",
      message:"You're logged in",
      nav,
      header,
      errors: null,
    });
  }
  next();
};

module.exports = validate;
