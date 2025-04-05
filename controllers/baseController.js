const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
const header = await utilities.getHeader(req, res);
  req.flash("notice","This is a flash message.")
  res.render("index", { title: "Home",nav, header  });
};

module.exports = baseController;
