const utilities = require("../utilities/")
const accountModel = require("../models/account-model") 
const bcrypt = require("bcryptjs") // Asegúrate de que esta línea esté aquí

/* ****************************************
* Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null, // Asegura que 'errors' siempre esté definido para la vista
  })
}

/* ****************************************
* Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
* Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword // Declara hashedPassword aquí
  try {
    // regular password and cost (salt is generated automatically)
    // Usando bcrypt.hash (asíncrono) con await, que es la mejor práctica.
    // Si tu curso insiste en bcrypt.hashSync, cámbialo a:
    // hashedPassword = bcrypt.hashSync(account_password, 10)
    hashedPassword = await bcrypt.hash(account_password, 10) 
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null, // Mantén esto para que la vista no falle
    })
    return // ¡Es crucial salir de la función si hay un error de hashing!
  }

  // Desplázate un poco más abajo y reemplaza account_password con hashedPassword
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // ¡Aquí se usa la contraseña hashificada!
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, // <<<<<<<<<<<<<< ESTA ES LA CORRECCIÓN CRÍTICA AQUÍ >>>>>>>>>>>>>>>>>>
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
* Process login request
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  req.flash("notice", "You logged in successfully.") // Mensaje temporal de éxito
  res.render("account/login", { // Redirige a la vista de login con el mensaje
    title: "Login",
    nav,
    errors: null, // Aseguramos que 'errors' se pase para evitar fallos si se renderiza directamente
  })
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin }