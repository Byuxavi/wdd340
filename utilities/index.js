const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 **************************/
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
      + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build the inventory detail view HTML
 * ************************************ */
Util.buildInvDetailGrid = async function (data) {
  let detailHtml = ''
  if (data.length > 0) {
    const vehicle = data[0]

    detailHtml += '<div id="inv-detail-display">'
    detailHtml += '<div class="inv-detail-image">'
    detailHtml += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">`
    detailHtml += '</div>'

    detailHtml += '<div class="inv-detail-info">'
    detailHtml += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`
    detailHtml += `<p class="price"><span>Price:</span> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
    detailHtml += `<p><span>Mileage:</span> ${vehicle.inv_miles != null ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles) : 'N/A'}</p>`
    detailHtml += `<p><span>Color:</span> ${vehicle.inv_color}</p>`
    detailHtml += `<p><span>Year:</span> ${vehicle.inv_year}</p>`
    detailHtml += `<p><span>Description:</span> ${vehicle.inv_description}</p>`
    detailHtml += '</div>'
    detailHtml += '</div>'

  } else {
    detailHtml += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detailHtml
}

/* **************************************
* Middleware For Handling Errors
* Wrap an async function in a try-catch block to catch errors
****************************************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util