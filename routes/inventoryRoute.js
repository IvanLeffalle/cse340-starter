//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
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

router.get(
  "/addinventory",
  utilities.handleErrors(invController.buidAddInv)
);

router.post("/addClassification",
  regValidate.classificationRules(),
  regValidate.checkClassData,
utilities.handleErrors(invController.addClassification)
);


router.post("/addVehicle",
  regValidate.vehicleRules(),
  regValidate.checkVehicleData,
utilities.handleErrors(invController.addVehicle));

module.exports = router;
