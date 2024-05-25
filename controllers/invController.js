const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by individual view
 * ************************** */
invCont.buildByIndividual = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryDetailsByInvId(inventory_id);
  console.log(`Control data = ${data.rows}`)
  const item = await utilities.buildIndividualItem(data[0]);
  let nav = await utilities.getNav();
  const className = data[0].inv_model;
  console.log(`className = ${className}`);
  res.render("./inventory/detail", {
    title: className,
    nav,
    item,
    errors: null,
  })
}

/* Build Error view for intentional error process */
invCont.buildErrorView = async function (req, res, next) {//err, 
  let nav = await utilities.getNav()
  const message = 'Error status 500: Something is broken! Try again.'
  res.render("errors/error", {
    title: Error || 'Server Error',  // err.status
    message,
    nav,
    errors:null,
  })
}

/* ***************************
 * Build vehicle management view
 *****************************/
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

module.exports = invCont