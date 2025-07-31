// controllers/accountController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = require("../utilities");
const accountModel = require("../models/account-model");

// W06/W07: Message model - Comment out for W04
// const messageModel = require("../models/message-model");


/* ****************************************
 * W05: Deliver registration view - Comment out for W04
 * *************************************** */
/*
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
*/

/* ****************************************
 * W05: Process Registration - Comment out for W04
 * *************************************** */
/*
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      errors: null,
      nav,
    });
  }
}
*/

/* ****************************************
 * W04: Deliver login view - Keep active for W04
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    errors: null,
    nav,
  });
}

/* ****************************************
 * W04: Process login post request - Keep active for W04
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;

      // W05: updateCookie is from W05, but needed for W04 login to set JWT.
      // We will keep utilities.updateCookie active as it's part of the JWT flow.
      utilities.updateCookie(accountData, res);

      // W05: Redirect to /account/ (management view) - Change for W04 to redirect to home
      // return res.redirect("/account/"); // Original for W05
      return res.redirect("/"); // Redirect to home for W04
    }
    else {
      req.flash("notice", "Please check your credentials and try again.");
      res.redirect("/account/login"); // Redirect to login page on bad password
    }
  } catch (error) {
    console.error("Login error:", error.message); // Log the actual error
    req.flash("notice", "An error occurred during login. Please try again.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

/* ****************************************
 * W05: Process account management get request - Comment out for W04
 * This function depends on messageModel, which is also W06/W07.
 * ************************************ */
/*
async function buildAccountManagementView(req, res) {
  let nav = await utilities.getNav();
  // The following line depends on messageModel, which is commented out for W04.
  // const unread = await messageModel.getMessageCountById(res.locals.accountData.account_id);

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    // unread, // Commented out as messageModel is not active
  });
  return;
}
*/

/* ****************************************
 * W05: Process logout request - Comment out for W04
 * ************************************ */
/*
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.");
  res.redirect("/");
  return;
}
*/

/* ****************************************
 * W05: Deliver account update view get - Comment out for W04
 * *************************************** */
/*
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav();

  const accountDetails = await accountModel.getAccountById(req.params.accountId);
  const {account_id, account_firstname, account_lastname, account_email} = accountDetails;
  res.render("account/update", {
    title: "Update",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  });
}
*/

/* ****************************************
 * W05: Process account update post - Comment out for W04
 * *************************************** */
/*
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated ${account_firstname}.`
    );

    const accountData = await accountModel.getAccountById(account_id);
    delete accountData.account_password;
    res.locals.accountData.account_firstname = accountData.account_firstname;
    utilities.updateCookie(accountData, res);

    res.status(201).render("account/account-management", {
      title: "Management",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      nav,
    });
  }
}
*/

/* ****************************************
 * W05: Process account password update post - Comment out for W04
 * *************************************** */
/*
async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update."
    );
    res.status(500).render("account/update", {
      title: "Update",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you've updated the password.`
    );
    res.status(201).render("account/account-management", {
      title: "Manage",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Update",
      errors: null,
      nav,
    });
  }
}
*/

// Export only the functions needed for W04
module.exports = {
  buildLogin,
  accountLogin,
  // W05 functions commented out for W04:
  // buildRegister,
  // registerAccount,
  // buildAccountManagementView,
  // accountLogout,
  // buildUpdate,
  // updateAccount,
  // updatePassword
};