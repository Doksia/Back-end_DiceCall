const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const {
    createCharacter,
    getMyCharacters,
    updateCharacter,
    deleteCharacter
} = require("../controllers/character.Controller");

router.post("/", protect, createCharacter);
router.get("/myCharacters", protect, getMyCharacters);
router.put("/:id", protect, updateCharacter);
router.delete("/:id", protect, deleteCharacter);

module.exports = router;