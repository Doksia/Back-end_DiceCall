const express = require("express")
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const {
    createCampaign,
    getAllCampaigns,
    updateCampaign,
    deleteCampaign,
} = require("../controllers/campaign.Controller");

router.get("/", getAllCampaigns);
router.post("/", protect, createCampaign);
router.post("/:id", protect, updateCampaign);
router.post("/:id", protect, deleteCampaign);

module.exports = router;