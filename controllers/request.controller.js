const Request = require("../models/Request.model");
const Campaign = require("../models/Campaign.model");

const sendRequest = async (req, res, next) => {
    try {
        const findCampaign = await Campaign.findById(campaign);
        if (!findCampaign) {
            return res.status(404).json({Error: "The campaign doesn't exist"});
        }
        if (findCampaign.status === "full") {
            return res.status(400).json({Error: "The campaign is already full"});
        }
        const newRequest = new Request ({
            applicant: req.payload._id,
            campaign,
            character,
            character,
            request_status
        });
        const savedRequest = await newRequest.save();
        res.status(201).json({
            savedRequest, 
            Success: "Your request has been sent"
        });
    } catch (error) {
        res.status(400).json({Error: "Error creating the request"});
        if (error.code === 11000) {
            return res.status(400).json({Error: "You have already sent a request with this character to this campaign"});
        }
    }
};

const getCampaignRequest = async (req, res, next) => {
    try {
        const { campaignId} = req.params;
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({Error: "Campaign not found"});
        }
        if (campaign.dm.toString() !== req.payload._id) {
            return res.status(403).json({Error: "You dont have permission to see the pending requests of this campaign"});
        }
        const request = await Request.find({campaign: campaignId})
        .populate("applicant", "username")
        .populate("character");
         res.status(201).json({
            savedRequest, 
            Success: "Success getting the requests"
        });
    } catch (error) {
        res.status(400).json({Error: "Error getting the requests"});
    }
};

const handleRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["accepted", "rejected"].includes(status)) {
            res.status(400).json({Error: "Request hasn't been accepted or rejected yet"});
        }
        const requestToHandle = await Request.findById(id).populate("campaign");
        if (!requestToHandle) {
            return res.status(404).json({Error: "Request not found"});
        }
        if (requestToHandle.campaign.dm.toString() !== req.payload._id) {
            res.status(403).json({Error: "You dont have permission to manage the requests"});
        }
        if (requestToHandle.status !== "pending") {
            res.status(400).json({Error: "This request has already been managed"});
        }
        if (status === "accepted") {
            const campaignToUpdate = await Campaign.findById(requestToHandle.campaign._id);
            if (campaignToUpdate.currentPlayers >= campaignToUpdate.maxPlayers) {
                res.status(400).json({Error: "You cant accept more players, the campaign is already full"});
            }
        } campaignToUpdate.currentPlayers += 1;
        requestToHandle.status = status;
        const updateRequest = await requestToHandle.save();
        res.json({message: `Request ${status === "accepted" ? "accepted" : "rejected"} successfully`, updatedRequest});
    } catch (error) {
        res.status(400).json({Error: "Error accepting/rejecting the requests"});
    }
};

module.exports = {
    sendRequest,
    geCampaignRequest,
    handleRequestStatus
};