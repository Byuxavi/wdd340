// Needed Resources
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view (¡ESTA ES LA LÍNEA FALTANTE!)
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(), // Middleware de reglas de validación
  regValidate.checkRegData,     // Middleware que maneja los errores o pasa al siguiente
  utilities.handleErrors(accountController.registerAccount)
)
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(), // Aplica las reglas de validación de login
  regValidate.checkLoginData, // Verifica los datos y maneja errores
  utilities.handleErrors(accountController.accountLogin) // Esta función la crearemos en el siguiente paso
)
module.exports = router;