const router = require("express").Router();
const protect = require("../middlewares/auth.middleware.js");

const {
    sendRequest,
    getCampaignRequest,
    handleRequestStatus,
    getPlayerRequests,
    deletePlayerRequest
} = require("../controllers/request.controller");

router.post("/", protect, sendRequest);
router.get("/campaign/:campaignId", protect, getCampaignRequest);
router.post("/:id", protect, handleRequestStatus);
router.get("/", protect, getPlayerRequests);
router.delete("/:id", protect, deletePlayerRequest);

module.exports = router;