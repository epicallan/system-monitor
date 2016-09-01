const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();

router.get('/', (req, res) => {
  res.send('system monitor app is running check the status route for domains state');
});

router.get('/status', (req, res) => {
  const monitorResults = req.monitor();
  Promise.all(monitorResults).then(values => {
    res.status(200).json(values);
  });
});

module.exports = router;
