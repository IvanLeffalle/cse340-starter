//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

//route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

//route to build inventory by classification view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInvId)
);

router.get("/", utilities.handleErrors(invController.buildInvManagement));

router.get(
  "/addclassification",
  utilities.handleErrors(invController.buildAddClassification)
);

module.exports = router;
