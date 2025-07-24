const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  
  res.render("index", {title: "Home", nav})
}



// controllers/baseController.js

// ... (otras funciones como buildHome) ...

/* ***************************
 * Build 500 Error Test View
 * ************************** */
baseController.build500Error = async function(req, res, next) {
    try {
    
        console.log("Attempting to trigger a 500 error..."); // Para ver en la consola si se llega aquí
        throw new Error("This is a 500 error test triggered by /error/500 route.");
    
    } catch (error) {
        
        next(error);
    }
}

// ... (module.exports = baseController) ...
module.exports = baseController
