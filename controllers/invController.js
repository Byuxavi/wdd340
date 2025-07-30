const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation") // Asegúrate de que esté aquí

const invCont = {}

/* ***************************
 * Build inventory by classification view
 * ***************************/
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
 * Build management view
 * ***************************/
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList() // Obtiene la lista completa de clasificaciones

  let grid = null; // Inicializa grid a null

  // Si hay un classification_id en la query string, obtener y construir la cuadrícula
  const classification_id = parseInt(req.query.classificationId); // Convertir a número

  if (!isNaN(classification_id) && classification_id > 0) { // Asegúrate de que es un número válido
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (data && data.length > 0) {
      grid = await utilities.buildClassificationGrid(data);
    } else {
      // Si no se encontraron vehículos para la clasificación seleccionada
      grid = '<p class="notice">Sorry, no matching vehicles could be found for this classification.</p>';
    }
  }

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationList, // Pasa la lista a la vista
    grid, // Pasa la cuadrícula (será null si no se seleccionó una clasificación o no hay datos)
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    // No necesitamos classificationList para este formulario GET inicial,
    // solo si se re-renderiza por un error de validación con sticky forms.
  })
}

/* ***************************
 * Build add new inventory view
 * ***************************/
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList() // Obtiene la lista dinámica
  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList, // Pasa la lista a la vista
    errors: null,
  })
}

/* ***************************
 * Process Add New Classification
 * ***************************/
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body

  // Nota: La validación de express-validator se manejará ANTES de esta función
  // en la cadena de middleware de la ruta. Por eso 'errors' aquí es 'null'
  // o se manejará en invValidate.checkClassificationData

  const classResult = await invModel.addClassification(classification_name)

  if (classResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    // *** CORRECCIÓN CLAVE: Redirigir a la página de gestión si es exitoso. ***
    // Esto asegura que `buildManagement` se ejecute y pase `classificationList`.
    res.status(201).redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, adding the new classification failed.")
    let nav = await utilities.getNav()
    // Si falla la inserción en la DB, re-renderiza el formulario de añadir clasificación.
    // También necesitamos la lista de clasificaciones si el formulario de añadir inventario la usa,
    // pero para add-classification.ejs en sí, no es estrictamente necesaria a menos que la plantilla lo pida.
    // Aunque no la use, para evitar futuros errores, la podemos pasar.
    const classificationList = await utilities.buildClassificationList() // Asegura que la lista esté disponible si el template la necesita.

    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null, // Asumiendo que `checkClassificationData` manejará los errores de validación.
      classificationList, // Asegurarse de que esté disponible si el EJS lo espera
      locals: {
        classification_name: classification_name // Para sticky forms
      }
    })
  }
}

/* ***************************
 * Process add new inventory
 * ***************************/
invCont.addInventory = async function (req, res) {
  const {
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
  } = req.body

  const invResult = await invModel.addInventory(
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
  )

  if (invResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    // Redirige de nuevo a la vista de gestión
    res.status(201).redirect("/inv/") // Redirección HTTP para POST
  } else {
    req.flash("notice", "Sorry, adding the new inventory failed.")
    // Renderiza la vista de añadir inventario de nuevo si falla
    let nav = await utilities.getNav()
    // *** CORRECCIÓN: Pasa el classification_id como número a buildClassificationList para que seleccione la opción correcta. ***
    let classificationList = await utilities.buildClassificationList(Number(classification_id))
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null, // No hay errores de validación aquí, solo un fallo de DB
      locals: { // Mantén la stickiness
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id // Asegúrate de que este también se pase a locals si es necesario para el sticky select
      }
    })
  }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ***************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classificationId)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0] && invData[0].inv_id) { // *** CORRECCIÓN: Verifica si invData[0] existe antes de acceder a .inv_id ***
    return res.json(invData)
  } else {
    // CORRECCIÓN: Si no hay datos, envia una respuesta 404 o un array vacío para el fetch
    // next(new Error("No Data Returned")) // Esto causaría un 500. Mejor enviar un JSON vacío o 404.
    return res.status(404).json({ message: "No Data Returned for this classification." });
  }
}

module.exports = invCont