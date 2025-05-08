const express = require("express");
const { getAndUpdateDevice } = require("../controllers/deviceController");
const { addReport } = require("../controllers/reportController");

const router = express.Router();

router.post("/update/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { temperature, battery } = req.body;
        if (temperature < 15 || temperature > 30) return res.send("Invalid temperature");
        if (battery < 0 || battery > 100) return res.send("Invalid battery");
        const device = await getAndUpdateDevice({ deviceId, temperature, battery });
        if (!device) return res.send("Device not found!");
        await addReport({ deviceId, temperature, battery });
        const now = new Date();
        res.send({
            value: device.value,
            calibration: device.calibration,
            on: device.on,
        });
    } catch (err) {
        console.log(err);
        res.send("An error occured!");
    }
});

module.exports = router;
