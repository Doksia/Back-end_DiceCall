const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});
router.post("/test-login", (req, res) => {
  res.json({ msg: "¡Express reads POST" });
});

router.use('/api/auth', require('./auth.routes'));
router.use('/api/user', require('./users.routes'));
router.use("/api/characters", require('./character.routes'));

module.exports = router;
