/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const errorMiddleware = require("./middlewares/errors-middleware")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")  

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// For parsing application/json
app.use(bodyParser.json())
// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })) 
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(express.static('public'));

/* ***********************
 * Routes
 *************************/
// Default route for the home page (the main website address)
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes (Nuevo: Movido a la sección de rutas)
app.use("/account", accountRoute)

// Route to trigger a 500 error (for testing)
app.get("/error/500", baseController.build500Error);

// Error handling middleware (should be last)
app.use(errorMiddleware);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})