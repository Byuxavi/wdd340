// utilities/account-validation.js

const utilities = require("../utilities");
const accountModel = require("../models/account-model"); // This import remains, but its methods are commented in the model file
const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 * W05: Registration Data Validation Rules - Comment out for W04
 * ********************************* */
/*
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
  ];
};
*/

/* **********************************
 * W05: Update Account Data Validation Rules - Comment out for W04
 * ********************************* */
/*
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        console.dir(req.body);
        const emailExists = await accountModel.checkExistingEmail(
          account_email, req.body.old_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),
  ];
};
*/

/* **********************************
 * W05: Update Password Data Validation Rules - Comment out for W04
 * ********************************* */
/*
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};
*/

/* **********************************
 * W04: Login Data Validation Rules - Keep active for W04
 * ********************************* */
validate.loginRules = () => {
    return [
      // valid email is required
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),

      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ];
};


/* ******************************
 * W05: Check data and return errors or continue to registration - Comment out for W04
 * ***************************** */
/*
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        });
        return;
    }
    next();
};
*/

/* ******************************
 * W05: Check data and return errors or continue to update - Comment out for W04
 * ***************************** */
/*
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/update/", {
          errors,
          title: "Update",
          nav,
          account_id,
          account_firstname,
          account_lastname,
          account_email,
      });
      return;
  }
  next();
};
*/

/* ******************************
 * W05: Check data and return errors or continue to update password - Comment out for W04
 * ***************************** */
/*
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body; // These are not used here, might be from an old copy-paste
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/update", { // Assumes "update" view for password changes
          errors,
          title: "Update",
          nav,
          // Removed account_id, account_firstname, account_lastname, account_email as they are not typically needed for password update form errors
      });
      return;
  }
  next();
};
*/


/* ******************************
 * W04: Check data and return errors or continue to login - Keep active for W04
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = [];
    errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        });
        return;
    }
    next();
};

// Export only the needed validation rules and checks
module.exports = validate;