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
const static = require("./routes/static")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", "./views")

/* ***********************
 * Routes // <--- NEW SECTION ADDED/MODIFIED HERE
 *************************/
// Default route for the home page (the main website address)
app.get("/", function(req, res){
  // 'index' refers to a file named 'index.ejs' inside your 'views' folder
  // The second argument is an object with data you can pass to your EJS template
  res.render("index", {title: "Home"}) // We pass a 'title' variable to the template
})

// Existing static routes (for CSS, images, etc.)
app.use(express.static('public'));



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