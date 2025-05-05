const express = require("express");
const { getReports, exportReport } = require("../controllers/reportController");

const router = express.Router();

router.post('/export', async (req, res) => {
  try {
    const { deviceIds, type } = req.body;
    const buffer = await exportReport({ deviceIds, type });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');
    res.send(buffer);
  } catch (err) {
    console.log(err);
    res.sendError("An error occured!");
  }
});

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
