const invModel = require("../models/inventory-model")
const Util = {}

/* *************************
 * Constructs the nav HTML unorderedlist
 **************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title=Home page">Home</a></li>'

    
}