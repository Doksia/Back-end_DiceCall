const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ Success: `Access confirmed: ${req.user.id}` });
});

module.exports = router;