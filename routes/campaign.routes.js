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
router.put("/:id", protect, updateCampaign);
router.delete("/:id", protect, deleteCampaign);

module.exports = router;