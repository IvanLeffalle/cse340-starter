//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities")

//route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId)) ;

//route to build inventory by classification view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;
