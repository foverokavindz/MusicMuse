const winston = require('winston');
const mongoose = require('mongoose');
require('express-async-errors');
// require('winston-mongodb');

module.exports = function () {
  // handle uncaught exceptions
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );

  // handle unhadled rejection
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // winston.add(
  //   new winston.transports.MongoDB({
  //     db: 'mongodb://localhost:27017/vidly',
  //   })
  // );
};
