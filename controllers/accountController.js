const utilities = require('../utilities')
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************************
 * Deliver Login view
 * *************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    console.log(`Account Data in accountLogin is: ${accountData.account_email}`)
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("/account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
     })
    return
    }
    if (await bcrypt.compare(account_password, accountData.account_password)) {
        console.log(`authentication success: ${accountData.account_password}`)
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
        return res.redirect("/account/")
     } else {
        req.flash("notice", "Incorrect password. Please try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            email,
        })
    }
    }

/* ****************************
 * Deliver registration view
 ********************************/
async function buildRegister(req, res, next) {
    console.log('Here is the registration view')
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* **************************
 * Process Registration
 ****************************/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try{
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* **************************
 * Deliver account management
 ***************************/
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    let reviews = utilities.displayAccountReviews(account_id)
    res.render("account/accountManagement", {
        title: "Account Management",
        nav,
        reviews,
        errors: null,
    })
}

/* ***************************
 * Check if employee or admin
 ***************************/
function checkEmployeeStatus(req, res, next) {
    if(req.cookies.jwt) {
        console.log(`In checkEmployeeStatus`)
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function(err, accountData) {
            console.log(`CheckEmployeeStatus: ${accountData.account_type}`)
            if(err) {
                req.flash("notice", "Please log in to access this page.");
                res.clearCookie("jwt");
                return res.redirect("/account/login");
            }
            // is account employee or admin
            if(accountData.account_type === "employee" || accountData.account_type === "admin") {
                res.locals.accountData = accountData;
                res.locals.loggedin = true;
                next();
            } else {
                req.flash("notice", "Access Denied.");
                return res.redirect("/account/");
            }
        })
    } else {
        req.flash("notice", "Please log in to access this page.");
        res.redirect("/account/login");
    }
}

/********************************
 *  Build Update Account Information
 ******************************* */
async function buildAccountUpdate(req, res, next) {
    let nav = await utilities.getNav();
    console.log("In buildAccountUpdate")
    let accountId =req.params.account_id;
    console.log(`params accountId: ${accountId}`)
    let accountData = res.locals.acccountData
    console.log(`local accountData: ${res.locals.accountData.account_id}`) // .account_id
    let accountDataById = await accountModel.getAccountById(accountId);
    console.log(`AccountDatabyId: ${accountDataById}`)
    res.render("account/account-update", {
        title: "Update Account Information",
        nav,
        accountData,
        accountDataById,
        errors: null,
    })
}

/********************************
 *  Update Account Information
 ******************************* */
async function updateAccount(req,res) {
    console.log(`You have reached the updateAccount method.`);
    let nav = await utilities.getNav();
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    console.log(`Account id: ${account_id}`)
    
    if(updateResult) {
        console.log(`accountData.accountId: ${accountData.account_id}`)
        const updatedAccountData = await accountModel.getAccountById(account_id);
        delete updatedAccountData.account_password;
        const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
        if(process.env.NODE_ENV === "development") {
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
        } else {
            res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000});
        }
        req.flash("notice", "Account update successful.");
        res.redirect("/account/");
    } else {
        req.flash("notice", "Account update not successful");
        res.status(500).render("account/account_update", {
            title: "Update Account Information",
            nav,
            accountData: {account_id, account_firstname, account_lastname, account_email },
            errors: null,
        });
    }
}

/* *****************************
* change password
* ***************************** */
async function changePassword(req,res) {
    let nav = await utilities.getNav();
    const { current_password, new_password, confirm_new_password } = req.body;
    const accountId = res.locals.accountData.account_id;
    const accountData = await accountModel.getAccountById(accountId);

    if(await bcrypt.compare(current_password, accountData.account_password)) {
        if(new_password === confirm_new_password) {
            const hashedPassword = await bcrypt.hash(new_password, 10);
            const updateResult = await accountModel.updatePassword(accountId, hashedPassword);
            
        if(updateResult) {
            req.flash("notice", "Password update successful.");
            res.redirect("/account/");
        } else {
            req.flash("notice", "Failed to change password");
            res.status(500).render("account/account-update", {
                title: "Update Password",
                nav,
                accountData,
                errors: null,
            })
          }
        } else {
            req.flash("notice", "Passwords do not match.");
            res.status(400).render("account/account-update", {
                title: "Update Password",
                nav,
                accountData,
                errors: null,
            })
        }
    } else {
        req.flash("notice", "Current password is incorrect.");
        res.status(400).render("account/account-update", {
            title: "Update Password",
            nav,
            accountData,
            errors: null,
        })
    }
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, checkEmployeeStatus, buildAccountUpdate, updateAccount, changePassword }






















