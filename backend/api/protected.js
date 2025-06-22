const express = require('express');
const authMiddleware = require('../middleware/middleware');

const router = express.Router();

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: "Protected profile route",
    userId: req.user.userId
  });
});

module.exports = router;
