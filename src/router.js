const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();

router.get('/', (req, res) => {
  res.send('system monitor app is running check the status route for domains state');
});

router.get('/status', (req, res) => {
  const monitorResults = req.monitor(); // added through middleware
  Promise.all(monitorResults).then(statuses => {
    res.status(200).json(statuses);
  });
});

module.exports = router;
