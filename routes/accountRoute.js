// routes/accountRoute.js

// Needed Resources
const express = require("express");
const router = new express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");


/* ****************************************
 * W05: Account Management View - Comment out for W04
 * *************************************** */
// router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

/* ****************************************
 * W04: Login Routes - Keep active for W04
 * *************************************** */
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

/* ****************************************
 * W05: Logout Route - Comment out for W04
 * *************************************** */
// router.get("/logout", utilities.handleErrors(accountController.accountLogout));

/* ****************************************
 * W05: Registration Handlers - Comment out for W04
 * *************************************** */
// router.get("/registration", utilities.handleErrors(accountController.buildRegister));
// router.post(
//   "/register",
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// );

/* ****************************************
 * W05: Update Account Handlers - Comment out for W04
 * *************************************** */
// router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
// router.post(
//   "/update",
//   regValidate.updateRules(),
//   regValidate.checkUpdateData,
//   utilities.handleErrors(accountController.updateAccount)
// );
// router.post(
//   "/update-password",
//   regValidate.updatePasswordRules(),
//   regValidate.checkUpdatePasswordData,
//   utilities.handleErrors(accountController.updatePassword)
// );


module.exports = router;