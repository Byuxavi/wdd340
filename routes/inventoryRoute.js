// routes/inventoryRoute.js

const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") // Asegúrate de importar utilities
const invValidate = require("../utilities/inventory-validation") // Importa tu validador

// Ruta para la vista de gestión de inventario
router.get("/", utilities.handleErrors(invController.buildManagement))

// Ruta para la vista de añadir nueva clasificación
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Ruta para procesar la nueva clasificación
router.post(
  "/add-classification",
  invValidate.classificationRules(), // <-- ¡CORREGIDO: Añade las reglas de validación!
  invValidate.checkClassificationData, // <-- ¡CORREGIDO: Añade el middleware de chequeo!
  utilities.handleErrors(invController.addClassification)
)

// Ruta para la vista de añadir nuevo inventario (vehículo)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Ruta para procesar el nuevo inventario (vehículo)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(), // <-- ¡CORREGIDO: Añade las reglas de validación!
  invValidate.checkInventoryData, // <-- ¡CORREGIDO: Añade el middleware de chequeo!
  utilities.handleErrors(invController.addInventory)
)

// Ruta para obtener inventario por clasificación como JSON (para el AJAX)
router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router