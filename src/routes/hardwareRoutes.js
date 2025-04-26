const express = require("express");
const { getAndUpdateDevice } = require("../controllers/deviceController");
const { addReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/update/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { temperature, battery } = req.body;
        const device = await getAndUpdateDevice({ deviceId, temperature, battery });
        if (!device) return res.send("Device not found!");
        await addReport({ deviceId, temperature, battery });
        res.send({
            value: device.value,
            on: device.on,
        });
    } catch (err) {
        console.log(err);
        res.send("An error occured!");
    }
});

router.get("/selected-devices", async (req, res) => {
    try {
        const devices = await getSelectedDevices({
            deviceIds: req.query.deviceIds,
        });
        res.sendResponse({ status: 1, devices });
    } catch (err) {
        res.sendError(err);
    }
});

router.get("/:deviceId", async (req, res) => {
    try {
        const device = await getDevice({ deviceId: req.params.deviceId });
        res.sendResponse({ status: 1, device });
    } catch (err) {
        res.sendError(err);
    }
});

router.post("/change-name", async (req, res) => {
    try {
        const { deviceId, name } = req.body;
        await changeDeviceName({ deviceId, name });
        res.sendResponse({ status: 1 });
    } catch (err) {
        res.sendError(err);
    }
});

router.post("/change", async (req, res) => {
    try {
        const { deviceIds, value, economy } = req.body;
        await changeDeviceValue({ deviceIds, value, economy });
        res.sendResponse({ status: 1 });
    } catch (err) {
        res.sendError(err);
    }
});

module.exports = router;
