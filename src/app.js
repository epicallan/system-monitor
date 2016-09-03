const express = require('express');
const logger = require('morgan');
const routes = require('./router');
const monitor = require('./monitor');
const app = express();
const INTERVAL = 60000 * 10; // check every after 10 mins

app.use(logger('dev'));

// run periodic checks
setInterval(() => {
  const monitorPromises = monitor();
  Promise.all(monitorPromises).then(console.log);
}, INTERVAL);

/* eslint-disable no-param-reassign */
// middle ware
app.use((req, res, next) => {
  // for status route add the monitor function to the request object
  if (req.path === '/status') req.monitor = monitor; 
  next();
});

app.use('/', routes);

module.exports = app;
