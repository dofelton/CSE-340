const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/******************
 * add inventory data validate rules
******************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Letters only please."),
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Letters only please."),
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Numbers only please."),
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Numeric only please."),
        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Numeric only please."),
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Letters only please.")
    ]
}

/**************************
 * validate data for inventory addition
 ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id, null)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classificationSelect,
            locals: {
                classification: classification_id,
                make: inv_make,
                model: inv_model,
                year: inv_year,
                description: inv_description,
                price: inv_price,
                miles: inv_miles,
                color: inv_color,
            }
        })
        return
    }
    next()
}

/**************************
 * validate data for inventory update
 ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id, null)
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit Inventory",
            nav,
            classificationSelect,
            locals: {
                classification: classification_id,
                make: inv_make,
                model: inv_model,
                year: inv_year,
                description: inv_description,
                price: inv_price,
                miles: inv_miles,
                color: inv_color,
                inv_id: inv_id,
            }
        })
        return
    }
    next()
}

module.exports = validate