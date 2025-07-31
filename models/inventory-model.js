// models/inventory-model.js

const pool = require("../database/");

/* ***************************
 * W02 / W04: Get all classification data - Keep active for W04
 * (Used for nav, and for "Add Classification" / "Add Inventory" forms)
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 * W04: Add new classification - Keep active for W04
 * ************************** */
async function addClassification(classification_name) {
  const sql = `INSERT INTO public.classification (classification_name)
    VALUES ($1)`;

  try {
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 * W02 / W04: Get all inventory items and classification_name by classification_id - Keep active for W04
 * (Used for displaying inventory by classification)
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
      [classification_id]
    );

    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
    // It's often better to throw errors and catch them at the controller level
    throw new Error("Failed to get inventory by classification ID.");
  }
}

/* ***************************
 * W03 / W04: Get a single inventory item by id - Keep active for W04
 * (Used for displaying vehicle details)
 * ************************** */
async function getInventoryByInventoryId(inventoryId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
        INNER JOIN public.classification
        ON public.inventory.classification_id = public.classification.classification_id
        WHERE inv_id = $1`,
      [inventoryId]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByInventoryId error" + error);
    throw new Error("Failed to get inventory by inventory ID.");
  }
}

/*******************************
 * W04: Add a single inventory item - Keep active for W04
 *******************************/
async function addInventory(
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
) {
  const sql = `INSERT INTO public.inventory
    ( inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id)
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 ) RETURNING *`; // Added RETURNING * to get the inserted row
  try {
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    ]);
    return result.rows[0]; // Return the inserted row
  } catch (error) {
    console.error("addInventory model error: " + error); // Changed from editInventory error
    throw new Error("Failed to add inventory item.");
  }
}

/* ***************************
 * W06: Update Inventory Data - Comment out for W04
 **************************** */
/*
async function updateInventory(
  inv_id,
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
) {
  const sql =
    "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
  try {
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("updateInventory model error: " + error); // Changed from addInventory error
    throw new Error("Failed to update inventory.");
  }
}
*/

/* ***************************
 * W06: Delete Inventory Data - Comment out for W04
 **************************** */
/*
async function deleteInventory(inv_id) {
  const sql = "DELETE FROM inventory WHERE inv_id = $1";
  try {
    const result = await pool.query(sql, [inv_id]);
    return result; // Or result.rowCount to confirm deletion
  } catch (error) {
    console.error("deleteInventory model error: " + error);
    throw new Error("Failed to delete inventory.");
  }
}
*/

// Export only the functions needed for W04
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  addInventory,
};

// Original module.exports (all functions) - commented out for W04
/*
module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory
};
*/