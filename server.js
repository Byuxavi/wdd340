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
const errorMiddleware = require("./middlewares/errors-middleware");
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/* ***********************
 * Routes
 *************************/
// Default route for the home page (the main website address)

app.get("/", baseController.buildHome) 
// Inventory routes
app.use("/inv", inventoryRoute)


// Existing static routes (for CSS, images, etc.)
app.use(express.static('public'));


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.get("/error/500", baseController.build500Error);

app.use(errorMiddleware);

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

