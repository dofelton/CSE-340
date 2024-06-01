const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate ={}

/* ********************
 * Classification Data Validation Rules
 ****************************************/
validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isAlphanumeric()
            .withMessage("Classification names cannot contain a space or special character")
    ]
}

/* ************************
 * Check classification data
 * **************************/
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate