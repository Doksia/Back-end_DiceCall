const mongoose = require('mongoose');
const characterSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Character name is required"],
        trim: true,
    },
    game_system: {
        type: String,
        required: [true, "Specify game system (ex: dnd E5, pathfinder E2, etc)"],
        trim: true,
    },
    race: {
        type: String,
        required: [true, "Specify characters race"],
        trim: true,
    },
    class: {
        type: String,
        required: [true, "Specify characters class and subclass (if any)"],
        trim: true,
    },
    level: {
        type: Number,
        required: true,
        min: [1, "minimum level is 1"],
        default: 1,
    },
    alignment: {
        type: String,
        required: [true, "Specify characters alignment"],
        trim: true,
    },
},
{
    timestamps: true,
});
const Character = mongoose.model("Character", characterSchema);

module.exports = Character;