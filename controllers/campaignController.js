const Campaign = require("../models/Campaign.model");
const createCampaign = async (req, res, next) => {
    try {
        const {game_system, format,  short_description, status, looking_for, current_players, max_players, campaign_level} = req.body;
        const newCampaign = new Campaign({
            dm: req.payload._id,
            game_system,
            format,
            short_description,
            status,
            looking_for,
            current_players,
            max_players,
            campaign_level
        });
        const savedCampaign = await newCampaign.save();
        res.status(201).json({
            savedCampaign, 
            Success: "Success creating new campaign"
        });
    } catch (error) {
        res.status(400).json({Error: "Error creating new campaign"});
    }
};

const getAllCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({ status: "open" }).populate("dm", "username");
        res.json(campaigns);
    } catch (error) {
        res.status(400).json({Error: "Error finding your campaigns"});
    }
};

const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findBy(id);
        if (!campaign) {
            return res.status(404).json({Error: "Campaign not found"});
        }
        if (campaign.dm.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You dont have the permission to edit this campaign"});
        }
        if (req.body.currentPlayers && req.body.maxPlayers) {
            if (Number(req.body.currentPlayers) >= Number(req.body.maxPlayers)) {
                req.body.status = "full";
            } else {
                req.body.status = "open";
            }
        }
        const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.json(updatedCampaign);
    } catch (error) {
        res.status(400).json({Error: "Error updating the campaign"});
    }
};