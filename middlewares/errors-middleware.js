// middlewares/errors-middleware.js

/* ****************************************
 * Error Handling Middleware
 * ****************************************/
async function handleError(err, req, res, next) {
    let message;
    let status = 500; // Default to 500 internal server error

    // Check if the error object has a status and message
    if (err.status) {
        status = err.status;
    }
    if (err.message) {
        message = err.message;
    } else {
        message = 'Oh snap! There was a crash. Try again later.';
    }

    console.error(`Error at: "${req.originalUrl}": ${message}`); // Log the error to the console

    res.status(status).render("errors/error", { // Render a custom error view
        title: `Error ${status}`,
        message,
        nav: await require('../utilities/index').getNav() // Dynamic nav for error page
    });
}

module.exports = handleError;