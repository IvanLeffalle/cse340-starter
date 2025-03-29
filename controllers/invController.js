const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const classificationModel =require ("../models/inventory-model")

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  console.log(data);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by Id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const vehicle = await utilities.buildVehicleGrid(data);
  let nav = await utilities.getNav();

  const className = data[0].inv_model;
  res.render("./inventory/vehicle", {
    title: className + " details",
    nav,
    vehicle,
  });
};

invCont.buildInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

invCont.buidAddInv = async function (req,res,next){
  let nav=await utilities.getNav();
  let dropdown = await utilities.buildClassificationList()
  res.render("./inventory/addInventory",{
    title:"Add New Inventory",
    nav,
    dropdown,
    errors: null,
  })
}


invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  try {
    const classificationResult = await classificationModel.addClassification(classification_name);
    
    if (classificationResult.rowCount > 0) { 
      req.flash("notice", `Congratulations, you\'re registered ${classification_name}.`);
    } else {
      req.flash("notice", "Sorry, the registration failed.");
    }
    res.redirect("/"); 
  } catch (error) {
    req.flash("notice", "An error occurred while registering.");
    res.redirect("/"); 
  }
};

invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;
  
  try {
    const addResult = await invModel.addInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    );
    
    if (addResult.rowCount > 0) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
    } else {
      req.flash("notice", "Sorry, the addition failed.");
    }
    res.redirect("/inv/");
    
  } catch (error) {
    console.error("Error in addVehicle:", error);
    const dropdown = await utilities.buildClassificationList();
    req.flash("notice", "An error occurred while adding the vehicle.");
    res.status(500).render("./inventory/addInventory", {
      title: "Add New Inventory",
      nav,
      dropdown,
      errors: null,
      ...req.body
    });
  }
};
module.exports = invCont;
