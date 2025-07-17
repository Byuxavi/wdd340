const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}



/* ***************************
 * Build 500 Error Test View
 * ************************** */
baseController.build500Error = async function(req, res, next) {
    // Provocar un error intencionalmente (ej. dividiendo por cero, o accediendo a algo indefinido)
    throw new Error("This is a 500 error test triggered by /error/500 route.");
    // O:
    // const data = undefinedValue.someProperty; // Esto también lanzaría un error
}

// ... (module.exports = baseController) ...
module.exports = baseController
