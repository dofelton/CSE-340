// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Util = require("../utilities")

// Route to build login view
router.get("/login", Util.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", Util.handleErrors(accountController.buildRegister))

// Route for registration submission
router.post('/register', Util.handleErrors(accountController.registerAccount))
module.exports = router;
