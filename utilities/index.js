const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  console.log(`data is ${data.rows}`)
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" ></a>'
      grid += '<div class="namePrice">'
      grid += '<hr >'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ***************************************
 * Build Individual Item HTML
 ******************************************/

Util.buildIndividualItem = async function(data){
  console.log(`Build data is ${data}`)
  let item
    {
    item = '<ul>'
    item += '<meta title="'+ data.inv_make + ' '+ data.inv_model + '/>'
    item += '<div id="detail-display">'
    item += '<ul id="item-display">'
    item += '<li>'
    item += '<img src="' + data.inv_image
    +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model
    +' on CSE Motors" />'
    item += '<div class="details">'
    item += '<h2>'+ data.inv_year + ' ' + data.inv_make + ' '+ data.inv_model + '</h2>'
    item += '<h3>Our Low Price $'+ new Intl.NumberFormat('en-US').format(data.inv_price) + '</h3>'
    item += '<p>Description: '+ data.inv_description + '</p>'
    item += '<p>Milage: '+ new Intl.NumberFormat('en-US').format(data.inv_miles) + '</p>'
    item += '<p>Color: ' + data.inv_color + '</p>'
    item += '</div>'
    item += '</div>'
  }
  return item
}

/* *******************
 * Middleware to check token validity
 *********************/
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        console.log(`Account data is: ${res.locals.accountData.rows}`)
        next()
      })
  } else {
    next()
  }
}

/***************************
 * Check Login
 **************************/
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    const totalItems = localStorage.length
    console.log(`total items: ${totalItems}`)
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/***************************
 * Check account type
 **************************/
// Util.checkType = (req, res, next) => {
//   console.log(`you are ${res.locals.loggedin}`)
//   if (res.locals.account_type == 'employee' || res.locals.account_type == 'admin') {
//     next()
//   } else {
//     req.flash("notice", "Access for employees and admin only.")
//     return res.redirect("/account/login")
//   }
// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ***********************************
 * Build classification list
 ***********************************/
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util