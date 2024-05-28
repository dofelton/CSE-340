// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//         res.status(200).send('login process')
//     }
// )

// Route to login process week 5
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process registration begining of week 4
// router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Route for registration submission
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// default "/" route or management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

module.exports = router;
