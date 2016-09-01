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
app.use((req, res, next) => {
  console.log('path: ', req.path);
  // add the monitor object to the request object so that we can call it at will
  // from a route
  if (req.path === '/status') req.monitor = monitor;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
});

module.exports = app;
