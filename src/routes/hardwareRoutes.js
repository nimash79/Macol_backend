const express = require("express");
const {
    getAndUpdateDevice,
    getDevice,
} = require("../controllers/deviceController");
const { addReport } = require("../controllers/reportController");
const { addEvent } = require("../controllers/eventController");
const { getRefreshRateType, getWeatherData } = require("../utils/helper");
const { fetchWeatherApi } = require("openmeteo");

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
                });
        } else
            await addReport({
                deviceId,
                temperature,
                battery,
                summer: device.summer,
                weather,
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

router.get("/weather", async (req, res) => {
    getWeatherData(req.body.latitude, req.body.longitude);
    res.json({ ok: true });

    // const params = {
    //     "latitude": req.body.latitude,
    //     "longitude": req.body.longitude,
    //     "hourly": ["temperature_2m", "relative_humidity_2m"],
    //     "current": ["temperature_2m", "relative_humidity_2m"],
    //     "timezone": "auto",
    // };
    // const url = "https://api.open-meteo.com/v1/forecast";
    // const responses = await fetchWeatherApi(url, params);

    // // Process first location. Add a for-loop for multiple locations or weather models
    // const response = responses[0];

    // // Attributes for timezone and location
    // const latitude = response.latitude();
    // const longitude = response.longitude();
    // const elevation = response.elevation();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const utcOffsetSeconds = response.utcOffsetSeconds();

    // console.log(
    //     `\nCoordinates: ${latitude}°N ${longitude}°E`,
    //     `\nElevation: ${elevation}m asl`,
    //     `\nTimezone: ${timezone} ${timezoneAbbreviation}`,
    //     `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
    // );

    // const current = response.current();
    // const hourly = response.hourly();

    // // Note: The order of weather variables in the URL query and the indices below need to match!
    // const weatherData = {
    //     current: {
    //         time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
    //         temperature_2m: current.variables(0)?.value(),
    //         relative_humidity_2m: current.variables(1)?.value(),
    //     },
    //     hourly: {
    //         time: Array.from(
    //             { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
    //             (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    //         ),
    //         temperature_2m: hourly.variables(0)?.valuesArray(),
    //         relative_humidity_2m: hourly.variables(1)?.valuesArray(),
    //     },
    // };

    // // 'weatherData' now contains a simple structure with arrays with datetime and weather data
    // console.log(
    //     `\nCurrent time: ${weatherData.current.time}`,
    //     `\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
    //     `\nCurrent relative_humidity_2m: ${weatherData.current.relative_humidity_2m}`,
    // );
    // console.log("\nHourly data", weatherData.hourly)
});

module.exports = router;
