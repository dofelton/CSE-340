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

/* ***************************
 * Build Error view for intentional error process
 ************************************ */
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
  // const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    // classificationSelect,
  })
}

/*****************************
 * Build add classification view
 ***************************** */
invCont.buildAddClassification = async function (req, res, next) {
  console.log("Inside buildAddClassificiaiton")
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***********************************
 * process Add Classification
 **********************************/
invCont.addClassification = async function (req, res, next) {
  console.log("Inside addClassificiaiton")
  let nav = await utilities.getNav()
  const classification_name = req.body
  const addResult = await invModel.addClassification(classification_name)
if (addResult) {
  console.log('Added Successfully')
    req.flash(
        "notice",
        `Congratulations, you\'ve added ${classification_name}.`
    )
    res.status(201).render("./inventory/add-classification", {
      title: "Add classification",
      nav,
  })
  } else {
    console.log('Add didnt happen')
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
    })
  }
}

/*****************************
 * Build add inventory view
 ***************************** */
invCont.buildAddInventory = async function (req, res, next) {
  console.log("Inside buildAddInventory")
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add inventory",
    nav,
    classificationSelect,
    errors: null,
  })
}

/* ***********************************
 * process Add Inventory
 **********************************/
invCont.addInventory = async function (req, res, next) {
  console.log("Inside addInventory")
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  const { classification_id, inv_make, inv_model, inv_year, inv_price, inv_description, inv_milage, inv_color } = req.body 
  const addResult = await invModel.addInventory(classification_id, inv_make, inv_model, inv_year, inv_price, inv_description, inv_milage, inv_color)
if (addResult) {
  console.log('Added Successfully')
    req.flash(
        "notice",
        `Congratulations, you\'ve added ${inv_model}.`
    )
    res.status(201).render("./inventory/add-inventory", {
      title: "Add inventory",
      nav,
      classificationSelect,
  })
  } else {
    console.log('Add didnt happen')
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("./inventory/add-inventory", {
        title: "Add inventory",
        nav,
        classificationSelect,
        errors: null,
    })
  }
}

module.exports = invCont;