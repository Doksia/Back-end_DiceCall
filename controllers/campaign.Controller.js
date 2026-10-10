const Campaign = require("../models/Campaign.model");
const createCampaign = async (req, res, next) => {
    try {
        const {game_system, format,  short_description, status, looking_for, current_players, max_players, campaign_level, communication_link} = req.body;
        const newCampaign = new Campaign({
            dm: req.payload._id,
            game_system,
            format,
            short_description,
            status,
            looking_for,
            current_players,
            max_players,
            campaign_level,
            communication_link
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
        const campaigns = await Campaign.find({ status: "Open" }).populate("dm", "username");
        res.json(campaigns);
    } catch (error) {
        res.status(400).json({Error: "Error finding your campaigns"});
    }
};

const updateCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({Error: "Campaign not found"});
        }
        if (campaign.dm.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You dont have the permission to edit this campaign"});
        }
        const { game_system, format, short_description, status, looking_for, current_players, max_players, campaign_level, communication_link } = req.body;
        let finalStatus = status || campaign.status;
        const current = req.body.current_players !== undefined ? Number(req.body.current_players) : campaign.current_players;
        const max = req.body.max_players !== undefined ? Number(req.body.max_players) : campaign.max_players;
        
        if (current >= max) {
            finalStatus = "Full";
        } else {
            finalStatus = "Open";
        }

        const updatedData = {
            game_system,
            format,
            short_description,
            status: finalStatus,
            looking_for,
            current_players: Number(current),
            max_players: Number(max),
            campaign_level: Number(campaign_level),
            communication_link
        };

        const updatedCampaign = await Campaign.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        });
        res.json(updatedCampaign);
    } catch (error) {
        res.status(400).json({Error: "Error updating the campaign"});
    }
};

const deleteCampaign = async (req, res, next) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (campaign.dm.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You are not allow to delete this campaign"});
        }
        await Campaign.findByIdAndDelete(id);
        res.json({Success: "Campaign successfully deleted"});
    } catch (error) {
        res.status(400).json({Error: "Error deleting the campaign"});
    }
};

module.exports = {
    createCampaign,
    getAllCampaigns,
    updateCampaign,
    deleteCampaign,
};