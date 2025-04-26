const express = require("express");
const { getReports } = require("../controllers/reportController");

const router = express.Router();

router.get("/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { type } = req.query;
        const reports = await getReports({ deviceId, type });
        res.sendResponse({ reports });
    } catch (err) {
        console.log(err);
        res.sendError("An error occured!");
    }
});

module.exports = router;
