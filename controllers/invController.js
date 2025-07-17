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
 * Build inventory by inv_id view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id) 
  const grid = await utilities.buildInvDetailGrid(data) 
  let nav = await utilities.getNav()
  const invMake = data[0].inv_make
  const invModelName = data[0].inv_model
  res.render("./inventory/detail", { 
    title: invMake + " " + invModelName + " details",
    nav,
    grid,
  })
}



// ... (module.exports = invCont) ...
  module.exports = invCont