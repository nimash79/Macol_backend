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

module.exports = router;
