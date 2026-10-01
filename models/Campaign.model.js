const mongoose = require('mongoose');
const campaignSchema = new mongoose.Schema({
    dm: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    game_system: {
        type: String,
        required: [true, "Specify game system (ex: dnd E5, pathfinder E2, etc)"],
        trim: true,
    },
    format: {
        type: String,
        required: true,
        enum: ["Online", "In-person", "Hybrid"],
        default: "Online",
    },
    short_description: {
        type: String,
        maxLength: [200, "Add a short description of the campaign"],
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["Open","Full"]
    },
    looking_for: {
        type: String,
        required: true,
        enum: ["All", "Healer", "Tank", "Dps", "Healer and Tank", "Healer and Dps", "Tank and Dps"],
        default: "All",
    },
    current_players: {
        type: Number,
        required: [true, "Specify how many players are already on the campaign (if any)"],
        min: [0, "The minimum players are 0"],
        default: 0,
    },
    max_players: {
        type: Number,
        required: [true, "Specify how many players this campaign would have at max"],
        min: [1, "At least 1 player"],
    },
    campaign_level: {
        type: Number,
        required: [true, "Specify the average level of your players in your current campaign (if any) or the level the players are starting at"],
        min: [1, "The minimum level is 1"],
        default: 1,
    },
}, 
{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

campaignSchema.virtual("slotsDisplay").get(function () {
    return '${this.current_players} / ${this.max_players}';
});
campaignSchema.virtual("availableSlots").get(function () {
    const slots = this.max_players - this.current_players;
    return slots > 0 ? slots: 0;
});
const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;