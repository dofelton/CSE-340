// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController");
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for the individual vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByIndividual))

// Router for intentional error
router.get("/error", utilities.handleErrors(invController.buildErrorView))

// Router for management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Router for add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

module.exports = router;