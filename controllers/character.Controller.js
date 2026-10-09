const Character = require("../models/Character.model");

const createCharacter = async (req, res) => {
    try {
        const {name, game_system, race, class: characterClass, level, alignment} = req.body;
        const newCharacter = new Character ({
            user: req.user._id,
            name,
            game_system,
            race,
            class: characterClass,
            level,
            alignment
        });
        const savedCharacter = await newCharacter.save();
         res.status(201).json({
            savedCharacter, 
            Success: "Success creating new character"
        });
    } catch (error) {
        res.status(400).json({Error: "Error creating new character"});
    }
};

const getMyCharacters = async (req, res, next) => {
    try {
        const characters = await Character.find({user: req.payload._id});
        res.json(characters);
    } catch (error) {
        res.status(400).json({Error: "Error finding your characters"});
    }
};

const updateCharacter = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const { name, game_system, race, class: characterClass, level, alignment } = req.body;
        
        const character = await Character.findById(id);
        if (!character) {
            return res.status(404).json({Error: "Character not found"});
        }
        if (character.user.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You are not allow to edit this character"});
        }
        const updatedCharacter = await Character.findByIdAndUpdate(
            id,
            { name, game_system, race, class: characterClass, level: Number(level), alignment },
            { new: true, runValidators: true }
        );
        res.json(updatedCharacter);
    } catch (error) {
        res.status(400).json({Error: "Error updating the character"});
    }
};

const deleteCharacter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const character = await Character.findByIdAndUpdate(id);
        if (!character) {
            return res.status(404).json({Error: "Character not found"});
        }
        if (character.user.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You are not allow to delete this character"});
        }
        await Character.findByIdAndDelete(id);
        res.status(200).json({Success: "Character successfully deleted"})
    } catch (error) {
        res.status(400).json({Error: "Error deleting the character"});
    }
};

module.exports = {
    createCharacter,
    getMyCharacters,
    updateCharacter,
    deleteCharacter
};