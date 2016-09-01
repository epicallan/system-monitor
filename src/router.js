const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();

router.get('/', (req, res) => {
  res.send('system monitor app is running');
});

module.exports = router;
