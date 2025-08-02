// utilities/index.js

const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");

require("dotenv").config(); // Ensure dotenv is loaded for process.env.ACCESS_TOKEN_SECRET

const Util = {};

/**
 * @typedef {Object} Message // This JSDoc type definition can remain, it's just documentation.
 * @property {number} message_id
 * @property {string} message_subject
 * @property {string} message_body
 * @property {Date} message_created
 * @property {number} message_to
 * @property {number} message_from
 * @property {boolean} message_read
 * @property {boolean} message_archived
 */


/* ************************
 * W02+: Constructs the nav HTML unordered list - Keep active for W05
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * W02+: Build the classification view HTML - Keep active for W05
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/**
 * W03+: Build a single listing element from data - Keep active for W05
 */
Util.buildItemListing = async function (data) {
  let listingHTML = "";
  if (data) {
    listingHTML = `
      <section class="car-listing">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        <div class="car-information">
          <div>
            <h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
          </div>
          <div>
            ${Number.parseFloat(data.inv_price).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div class="description">
            <p>
              ${data.inv_description}
            </p>
            <dl>
              <dt>MILEAGE</dt>
              <dd>${data.inv_miles.toLocaleString("en-US", {
                style: "decimal",
              })}</dd>
              <dt>COLOR</dt>
              <dd>${data.inv_color}</dd>
              <dt>CLASS</dt>
              <dd>${data.classification_name}</dd>
            </dl>
          </div>

        </div>
      </section>
    `;
  } else {
    listingHTML = `
      <p>Sorry, no matching vehicles could be found.</p>
    `;
  }
  return listingHTML;
};

/**
 * W04: Build an HTML select element with classification data - Keep active for W05
 * @param {int} classification_id
 * @returns {string}
 */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * W03+: Middleware For Handling Errors - Keep active for W05
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * W05: Middleware to check JWT token validity - Keep active for W05
 * Sets res.locals.loggedin and res.locals.accountData if a valid token exists.
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in"); // Added "notice" type for consistency
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next(); // Continue even if no token, allows public pages to load
  }
};

/**
 * W05: Function to update the browser cookie (JWT) - Keep active for W05
 * @param {object} accountData
 * @param {import("express").Response} res
 */
Util.updateCookie = (accountData, res) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600,
  });
  if (process.env.NODE_ENV === "development") {
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
  } else {
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};


/* ****************************************
 * W05: Check Login Middleware - Keep active for W05
 * Redirects if not logged in.
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};


/* ****************************************
 * W05: Check authorization (Manager/Admin) Middleware - Keep active for W05
 * Redirects if not authorized.
 * ************************************ */
Util.checkAuthorizationManager = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        if (
          accountData.account_type == "Employee" ||
          accountData.account_type == "Admin"
        ) {
          next();
        } else {
          req.flash("notice", "You are not authorized to modify inventory.");
          return res.redirect("/account/login");
        }
      }
    );
  } else {
    req.flash("notice", "You are not authorized to modify inventory.");
    return res.redirect("/account/login");
  }
};


/**
 * W06: Build an html table string from the message array (Inbox view) - Comment out for W05
 * @param {Array<Message>} messages
 * @returns
 */
/*
Util.buildInbox = (messages) => {
  // Ensure messages is an array, even if empty
  if (!Array.isArray(messages) || messages.length === 0) {
    return `<p>No messages found in your inbox.</p>`;
  }

  let inboxList = `
  <table>
    <thead>
      <tr>
        <th>Received</th><th>Subject</th><th>From</th><th>Read</th>
      </tr>
    </thead>
    <tbody>`;

  messages.forEach((message) => {
    inboxList += `
    <tr>
      <td>${message.message_created.toLocaleString()}</td>
      <td><a href="/message/view/${message.message_id}">${message.message_subject}</a></td>
      <td>${message.account_firstname} ${message.account_lastname} (${message.account_type})</td>
      <td>${message.message_read ? "✓" : " "}</td>
    </tr>`;
  });

  inboxList += `
  </tbody>
  </table> `;
  return inboxList;
};
*/

/**
 * W06: Build recipient list for messages - Comment out for W05
 */
/*
Util.buildRecipientList = (recipientData, preselected = null) => {
  let list = `<select name="message_to" required>`;
  list += '<option value="">Select a recipient</option>';

  recipientData.forEach((recipient) => {
    list += `<option ${preselected == recipient.account_id ? "selected" : ""} value="${recipient.account_id}">${recipient.account_firstname} ${recipient.account_lastname}</option>`
  });
  list += "</select>"

  return list;
};
*/

module.exports = Util;