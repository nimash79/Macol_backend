const express = require("express");
const { getDevice, getDevicesOfUser, changeDeviceName, changeDeviceValue, getSelectedDevices, createDevice } = require("../controllers/deviceController");

const router = express.Router();

router.get('/me', async (req, res) => {
    try {
        const devices = await getDevicesOfUser({ userId: req.user.id });
        res.sendResponse({ status: 1, devices });
    } catch (err) {
        res.sendError(err);
    }
})

router.get('/selected-devices', async (req, res) => {
    try {
        const devices = await getSelectedDevices({ deviceIds: req.query.deviceIds });
        res.sendResponse({ status: 1, devices });
    } catch (err) {
        res.sendError(err);
    }
})

router.get('/:deviceId', async (req, res) => {
    try {
        const device = await getDevice({ deviceId: req.params.deviceId });
        res.sendResponse({ status: 1, device });
    } catch (err) {
        res.sendError(err);
    }
})


router.post('/change-name', async (req, res) => {
    try {
        const { deviceId, name } = req.body;
        const status = await changeDeviceName({ userId: req.user.id, deviceId, name });
        res.sendResponse({ status });
    } catch (err) {
        res.sendError(err);
    }
})

router.post('/change', async (req, res) => {
    try {
        const { deviceIds, value, economy } = req.body;
        await changeDeviceValue({ deviceIds, value, economy });
        res.sendResponse({ status: 1 });
    } catch (err) {
        res.sendError(err);
    }
})

router.post('/create', async (req, res) => {
    try {
        await createDevice({ userId: req.user.id })
        res.sendResponse({ status: 1 });
    } catch (err) {
        res.sendError(err);
    }
})

module.exports = router;