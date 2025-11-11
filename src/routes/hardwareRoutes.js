const express = require("express");
const {
    getAndUpdateDevice,
    getDevice,
} = require("../controllers/deviceController");
const { addReport } = require("../controllers/reportController");
const { addEvent } = require("../controllers/eventController");
const { getRefreshRateType, getWeatherData, isTodayHoliday } = require("../utils/helper");

const router = express.Router();

router.post("/updateeeeeeeeeeeeeeeeee/:deviceId", async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { temperature, battery, value, manual } = req.body;
        if (temperature < 0 || temperature > 70)
            return res.send("Invalid temperature");
        if (battery < 0 || battery > 100) return res.send("Invalid battery");
        const device = await getDevice({ deviceId });
        const weather = await getWeatherData(device.latitude, device.longitude);
        const isHoliday = await isTodayHoliday();
        if (manual) {
            if (device)
                await addEvent({
                    deviceId,
                    roomTemp: temperature,
                    targetTemp: value,
                    prevTargetTemp: device.value,
                    summer: device.summer,
                    actionType: "set_temp",
                    weather,
                    isHoliday,
                });
        } else
            await addReport({
                deviceId,
                temperature,
                battery,
                summer: device.summer,
                weather,
                isHoliday,
            });
        const { device: updatedDevice, reset } = await getAndUpdateDevice({
            deviceId,
            temperature,
            battery,
            value,
            manual,
        });
        if (!updatedDevice) return res.send("Device not found!");
        res.send({
            value: updatedDevice.value,
            calibration: updatedDevice.calibration,
            on: updatedDevice.on,
            summer: updatedDevice.summer,
            refreshRate: getRefreshRateType(updatedDevice.refreshRateType),
            wifi: updatedDevice.wifi,
            reset,
        });
    } catch (err) {
        console.log(err);
        res.send("An error occured!");
    }
});

module.exports = router;
