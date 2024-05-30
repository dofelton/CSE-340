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

// Router for inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Router for add-classification view
router.get("/add-classification/", utilities.handleErrors(invController.buildAddClassification))

// Router to post add-classification
router.post("/add-classification/", utilities.handleErrors(invController.addClassification))

// Router for add-inventory view
router.get("/add-inventory/", utilities.handleErrors(invController.buildAddInventory))

// Router to post add-inventory
router.post("/add-inventory/", utilities.handleErrors(invController.addInventory))

// Router to get inventory JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// route for inventory edit
router.get("/edit/:inventoryId", utilities.handleErrors(invController.editInventory))

// router to process the inventory update
router.post("/edit/:inventoryId", utilities.handleErrors(invController.updateInventory))

// route for delete inventory
router.get("/delete/:inventoryId:", utilities.handleErrors(invController.buildDeleteView))

// route to process delete inventory
router.post("/delete/:inv_id", utilities.handleErrors(invController.deleteInventory))

module.exports = router;