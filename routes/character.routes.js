const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const {
    createCharacter,
    getMyCharacters,
    updateCharacter,
    deleteCharacter
} = require("../controllers/characterController");

router.post("/", protect, createCharacter);
router.post("/myCharacters", protect, getMyCharacters);
router.post("/:id", protect, updateCharacter);
router.post("/:id", protect, deleteCharacter);

module.exports = router;