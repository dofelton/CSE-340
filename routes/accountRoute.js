// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountsController = require("../utilities/index")

// Route to Login View
router.get("/type/:login", accountController.);

module.exports = router;
