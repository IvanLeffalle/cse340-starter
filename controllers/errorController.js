const utilities = require("../utilities");
const errorController = {};

errorController.buildError = async function (req, res) {
  const nav = await utilities.getNav();
  const errorPage = await utilities.error500Page();

  res.status(500).render("errors/error", {
    title: err.status || "Error 500",
    nav,
    errorPage,
  });
};

module.exports = errorController;
