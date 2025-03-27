const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li class=vehicle >";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};
/* **************************************
 * Build the vehicle view HTML
 * ************************************ */

Util.buildVehicleGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<div id="vehicle-img">';
    grid +=
      '<img src="' +
      data[0].inv_image +
      '" alt="Image of ' +
      data[0].inv_model +
      '" />';
    grid += "</div>";
    grid += '<div id="vehicle-details">';
    grid += "<h2>" + data[0].inv_make + " " + data[0].inv_model + "</h2>";
    grid +=
      "<h3>Price: $" +
      new Intl.NumberFormat("en-US").format(data[0].inv_price) +
      "</h3>";
    grid += "<p>" + data[0].inv_description + "</p>";
    grid += "<p><b>Color</b>: " + data[0].inv_color + "</p>";
    grid += "<p><b>Miles</b>: " + data[0].inv_miles + "</p>";
    grid += "<p><b>Year</b>: " + data[0].inv_year + "</p>";
    grid += "</div>";
  } else {
    grid = '<p class="notice">Sorry, no vehicle details available.</p>';
  }
  return grid;
};

Util.error500Page = async function (req, res, next) {
  let grid;
  grid = '<div id="error-500">';
  grid += "<H1>Error 500" + "</H3>";
  return grid;
};

//login form
Util.loginForm = async function () {
  let form;
  form = '<form id="login-form">';
  form += '<label for="email"> email </label>';
  form += '  <input id="email" name="account_email" type="email" required>';

  form += '<label for="password"> Password </label>';
  form += ' <input id="pword" name="account_password" type="password" required pattern="^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$" title="Password must be at least 12 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.">';

  form += '<button id onClick="submit">Login</button>';
  form += "</form>";

  form += '<div class="sing-up-link">';
  form += '<span>No account? <a href="/account/register">Sing-up</a></span>';
  form += "</div>";

  return form;
};

//register form
Util.registerForm = async function () {
  let form = `
    <form id="login-form" action="/account/register" method="post">
      <label for="firstName"> First Name </label>
      <input id="firstName" name="account_firstname" type="text" required>

      <label for="lastName"> Last Name </label>
      <input id="lastName" name="account_lastname" type="text" required>

      <label for="email"> Email Address </label>
      <input id="email" name="account_email" type="email" required>

      <label for="password"> Password </label>
      <input id="pword" name="account_password" type="password" required
        pattern="^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$"
        title="Password must be at least 12 characters long, include at least 1 uppercase letter, 1 number, and 1 special character.">
      <span id="pswdBtn">Show Password</span>

      <button type="submit" id="register-btn">Register</button>

      <p id="password-error" style="color: red; display: none;">
        Password must be at least 12 characters long, contain an uppercase letter, a number, and a special character.
      </p>
    </form>
  `;

  return form;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 *  **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
