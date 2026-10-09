const Request = require("../models/Request.model");
const Campaign = require("../models/Campaign.model");

const sendRequest = async (req, res, next) => {
    try {
        const { campaign, character, request_status } = req.body;
        
        const findCampaign = await Campaign.findById(campaign);
        if (!findCampaign) {
            return res.status(404).json({Error: "The campaign doesn't exist"});
        }
        if (findCampaign.status === "full") {
            return res.status(400).json({Error: "The campaign is already full"});
        }
        const newRequest = new Request ({
            applicant: req.payload?._id || req.user?._id,
            campaign,
            character,
            request_status: request_status || "Pending"
        });
        const savedRequest = await newRequest.save();
        return res.status(201).json({
            savedRequest, 
            Success: "Your request has been sent"
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({Error: "You have already sent a request with this character to this campaign"});
        }
        return res.status(400).json({Error: "Error creating the request"});
    }
};

const getCampaignRequest = async (req, res, next) => {
    try {
        const { campaignId } = req.params;
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({Error: "Campaign not found"});
        }
        if (campaign.dm.toString() !== req.payload?._id) {
            return res.status(403).json({Error: "You dont have permission to see the pending requests of this campaign"});
        }
        const request = await Request.find({campaign: campaignId})
        .populate("applicant", "username")
        .populate("character");

        return res.status(200).json({
            requests: request, 
            Success: "Success getting the requests"
        });
    } catch (error) {
        return res.status(400).json({Error: "Error getting the requests"});
    }
};

const handleRequestStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 
        const currentStatus = status || req.body.request_status;

        if (!["accepted", "rejected", "Accepted", "Rejected"].includes(currentStatus)) {
            return res.status(400).json({Error: "Request hasn't been accepted or rejected yet"});
        }
        
        const requestToHandle = await Request.findById(id).populate("campaign");
        if (!requestToHandle) {
            return res.status(404).json({Error: "Request not found"});
        }
        
        const currentUserId = req.payload?._id || req.user?._id;
        if (requestToHandle.campaign.dm.toString() !== currentUserId) {
            return res.status(403).json({Error: "You dont have permission to manage the requests"});
        }
        
        if (currentStatus.toLowerCase() === "accepted") {
            const campaignToUpdate = await Campaign.findById(requestToHandle.campaign._id);
            if (campaignToUpdate.current_players >= campaignToUpdate.max_players) {
                return res.status(400).json({Error: "You cant accept more players, the campaign is already full"});
            }
            campaignToUpdate.current_players += 1;
            await campaignToUpdate.save();

            requestToHandle.request_status = "Accepted";
            const updatedRequest = await requestToHandle.save();
            return res.json({message: `Request processed successfully`, updatedRequest});
        } 
       
        if (currentStatus.toLowerCase() === "rejected") {
            await Request.findByIdAndDelete(id);
            return res.json({
                message: `Request rejected and cleared successfully`, 
                updatedRequest: { _id: id, request_status: "Rejected", status: "Rejected" }
              });
        }
        
    } catch (error) {
        return res.status(400).json({Error: "Error accepting/rejecting the requests"});
    }
};

const getPlayerRequests = async (req, res, next) => {
    try {
        const userId = req.payload?._id || req.user?._id;
        
        const requests = await Request.find({ applicant: userId })
            .populate("campaign")
            .populate("character");
            
        res.json(requests);
    } catch (error) {
        res.status(400).json({ Error: "Error finding your requests" });
    }
};

module.exports = {
    sendRequest,
    getCampaignRequest,
    handleRequestStatus,
    getPlayerRequests
};