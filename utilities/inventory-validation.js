/// utilities/inventory-validation.js

const { body, validationResult } = require("express-validator")
const validate = {} // Objeto para contener los middlewares de validación

// Necesitamos importar el modelo de inventario para la validación de duplicados
const invModel = require("../models/inventory-model")
// Necesitamos importar utilities para acceder a funciones como getNav y buildClassificationList
const utilities = require(".") // Esto importa el archivo index.js de la carpeta utilities

/* **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification already exists. Please use a different name.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let nav = await utilities.getNav()
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      locals: {
        classification_name: classification_name
      }
    })
    return
  }
  next()
}

/* **********************************
 * Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a make of at least 3 characters."),

        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a model of at least 3 characters."),

        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
            .withMessage("Please provide a valid 4-digit year (e.g., 2023)."),

        body("inv_description")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path.")
            .matches(/^\/images\/vehicles\/[^/\\]+\.(png|jpg|jpeg|gif|webp)$/)
            .withMessage("Image path must be a valid format (e.g., /images/vehicles/imagen.jpg)."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path.")
            .matches(/^\/images\/vehicles\/[^/\\]+-tn\.(png|jpg|jpeg|gif|webp)$/)
            .withMessage("Thumbnail path must be a valid format (e.g., /images/vehicles/imagen-tn.jpg)."),

        body("inv_price")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price (e.g., 25000.00)."),

        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage (e.g., 10000)."),

        body("inv_color")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a color of at least 3 characters."),

        body("classification_id")
            .trim()
            .isInt({ min: 1 })
            .withMessage("Please select a classification."),
    ]
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  } = req.body
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(Number(classification_id))
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      classificationList,
      locals: {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      }
    })
    return
  }
  next()
}

module.exports = validate