const winston = require('winston');

module.exports = function (err, req, res, next) {
  // log the exception
  // error - warn - info - verbose - debug - silly
  winston.error(err.message, err);
  res.status(500).send('something Failed');
};

/*

The error.js file is a middleware that helps handle errors that occur during the
 execution of a route handler. It is essential to have error-handling middleware 
 because, without it, an error in one of the route handlers would crash the server, 
 making it difficult to diagnose the problem.

The error handling middleware intercepts errors that occur in the route handlers 
and sends an appropriate response to the client, indicating that an error has
 occurred. This middleware allows for better handling of errors and ensures that 
 the server continues to function correctly even when an error occurs.

*/
