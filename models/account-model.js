// models/account-model.js

const pool = require("../database/");


async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}


async function checkExistingEmail(account_email, excludedEmail = null) {
  try {
    if(excludedEmail) {
      const sql = "SELECT * FROM account WHERE account_email = $1 AND account_email != $2";
      const email = await pool.query(sql, [account_email, excludedEmail]);
      return email.rowCount;
    }
    else {
      const sql = "SELECT * FROM account WHERE account_email = $1";
      const email = await pool.query(sql, [account_email]);
      return email.rowCount;
    }
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 * W04: Return account data using email address - Keep active for W04 (Login functionality)
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    // Returning a new Error object might be preferable to throwing it here directly
    // to allow the calling function to handle it gracefully.
    // For W04, if no account is found, it just means login fails, which is fine.
    return new Error("No matching email found");
  }
}

/* *****************************
 * W04: Return account data using account id - Keep active for W04 (used by checkLogin middleware)
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    // Similar to getAccountByEmail, handle error gracefully
    return new Error("No matching account found by ID");
  }
}


async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try{
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    return result; // TODO: See what the requirement wants
  } catch(error) {
    return new Error("Update failed");
  }
}

async function updatePassword(account_id, hashed_password) {
  try{
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2"
    const result = await pool.query(sql, [hashed_password, account_id]);
    return result; // TODO: See what the requirement wants
  } catch(error) {
    return new Error("Update password failed")
  }
}

/* *****************************
 * W06: Get list of all accounts (for message recipient dropdown) - Comment out for W04
 * (Although used in messageController, messageController is fully commented out for W04)
 **************************** */
/*
async function getAccountList() {
  const sql = "SELECT account_id, account_firstname, account_lastname FROM public.account";
  try {
    const response = await pool.query(sql);
    return response.rows;
  }
  catch(error) {
    return new Error("Failed to get account list");
  }
}
*/


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword};