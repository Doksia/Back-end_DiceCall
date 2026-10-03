const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Character",
        required: true,
    },
    status: {
        type: string,
        required: true,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    },
},
{
    timestamps: true,
});
requestSchema.index({ campaign: 1, character: 1}, {unique: true});
const Request = mongoose.model("Request", requestSchema);

module.exports = Request;