// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process the login attempt week 4
// router.post(
//     "/login",
//     (req, res) => {
//         res.status(200).send('login process')
//     }
// )

// Route to login process week 5
router.post(
    "/login",
    (req, res, next) => {
        console.log("Request body:", JSON.stringify(req.body, null, 2));
        next();
    },
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
router.get("/", utilities.handleErrors(accountController.buildManagement))  // , utilities.checkLogin

// Route for account logout
router.get(
    '/logout',
    (req, res) => {res.clearCookie('jwt');
        res.redirect('/')
    }
)

// build account update 
router.get("/account-update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))

// process account update
router.post(
    "/account-update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.updateAccount)
)

router.post(
    "/change-password",
    utilities.checkLogin,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router;
