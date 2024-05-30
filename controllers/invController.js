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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
  })
}

/*****************************
 * Build add classification view
 ***************************** */
invCont.buildAddClassification = async function (req, res, next) {
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
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const addResult = await invModel.addClassification(classification_name)
if (addResult) {
  console.log('Added Successfully')
    req.flash(
        "notice",
        `Congratulations, you\'ve added ${classification_name}.`
    )
    res.status(201).render("./inventory/management", {
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
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body 
  console.log(inv_make)
  const addResult = await invModel.addInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
if (addResult) {
  console.log('Added Successfully')
    req.flash(
        "notice",
        `Congratulations, you\'ve added ${inv_model}.`
    )
    res.status(201).render("./inventory/management", {
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

/* *******************************
 * Return Inventory by Classification as JSON
 * *******************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    NodeList(new Error("No data returned"))
  }
}

/*****************************
 * Build edit inventory view
 ***************************** */
invCont.editInventory = async function (req, res, next) {
  console.log('In the edit inventory function')
  const inventory_id = parseInt(req.params.inventoryId)
  console.log(`inventory_id is: ${inventory_id}`)
  let nav = await utilities.getNav()
  let data = await invModel.getInventoryDetailsByInvId(inventory_id);
  data = data[0]
  let name = `${data.inv_make} ${data.inv_model}`
  console.log(`data is: ${name}`)
  const classificationSelect = await utilities.buildClassificationList(data.classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ***********************************
 * process update Inventory
 **********************************/
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body 
  const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
if (updateResult) {
  const itemName = updateResult.inv_make + " " + updateResult.inv_model
  req.flash("notice", `The ${itemName} was successfully updated.`)
  res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/edit-inventory", {
        title: "Edit" + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    })
  }
}

/* ***********************************
 * process delete Inventory
 **********************************/
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.body 
  const deleteResult = await invModel.deleteInventory(inv_id)
if (updateResult) {
  const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
  req.flash("notice", `The ${itemName} was successfully deleted.`)
  res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./management/", {
        title: "Edit" + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
    })
  }
}


module.exports = invCont;