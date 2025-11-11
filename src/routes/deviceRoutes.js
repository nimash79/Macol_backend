const express = require("express");
const {
  getDevice,
  getDevicesOfUser,
  changeDeviceName,
  changeDeviceValue,
  changeDeviceSettings,
  getSelectedDevices,
  changeDeviceOnStatus,
  deleteDevices,
  addDevice,
  changeCalibration,
  changeDeviceOffDates,
  changeDevicesFeatures,
  changeDeviceOffTimes,
} = require("../controllers/deviceController");
const { addEvent } = require("../controllers/eventController");
const { getWeatherData, isTodayHoliday } = require("../utils/helper");

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const devices = await getDevicesOfUser({ userId: req.user.id });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
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
    const status = await changeDeviceName({
      userId: req.user.id,
      deviceId,
      name,
    });
    res.sendResponse({ status });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change", async (req, res) => {
  try {
    const { deviceIds, value, economy } = req.body;

    for (const deviceId of deviceIds) {
      console.log(deviceId);
      try {
        const device = await getDevice({ deviceId });
        if (device) {
          const weather = await getWeatherData(
            device.latitude,
            device.longitude
          );
          const isHoliday = await isTodayHoliday();
          await addEvent({
            deviceId,
            roomTemp: device.temperature,
            targetTemp: value,
            prevTargetTemp: device.value,
            summer: device.summer,
            actionType: "set_temp",
            weather,
            isHoliday,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    await changeDeviceValue({ deviceIds, value, economy });
    res.sendResponse({ status: 1 });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-settings", async (req, res) => {
  try {
    const { deviceIds, economy_value, economy_start, economy_end } = req.body;
    const devices = await changeDeviceSettings({
      deviceIds,
      economy_value,
      economy_start,
      economy_end,
    });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-on", async (req, res) => {
  try {
    const { deviceId, on } = req.body;
    await changeDeviceOnStatus({ deviceId, on });
    const device = await getDevice({ deviceId });
    if (device) {
      const weather = await getWeatherData(device.latitude, device.longitude);
      const isHoliday = await isTodayHoliday();
      await addEvent({
        deviceId,
        roomTemp: device.temperature,
        targetTemp: device.value,
        prevTargetTemp: on ? null : device.value,
        summer: device.summer,
        actionType: on ? "turn_on" : "turn_off",
        weather,
        isHoliday,
      });
    }
    res.sendResponse({ status: 1 });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    const devices = await addDevice({
      userId: req.user.id,
      mobile: req.user.mobile,
      count: req.body.count,
    });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/delete", async (req, res) => {
  try {
    const { deviceIds } = req.body;
    await deleteDevices({ deviceIds });
    res.sendResponse({ status: 1 });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-calibration", async (req, res) => {
  try {
    const { deviceIds, calibration } = req.body;
    const devices = await changeCalibration({ deviceIds, calibration });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-off-dates", async (req, res) => {
  try {
    const { deviceIds, off_dates } = req.body;
    const devices = await changeDeviceOffDates({
      deviceIds,
      off_dates,
    });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-features", async (req, res) => {
  try {
    const { summer, refreshRateType, wifi } = req.body;
    if (
      req.user == undefined ||
      summer == undefined ||
      refreshRateType == undefined ||
      wifi == undefined
    )
      return res.sendError("Bad Requst", 400);
    const devices = await changeDevicesFeatures({
      userId: req.user.id,
      summer,
      refreshRateType,
      wifi,
    });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

router.post("/change-off-times", async (req, res) => {
  try {
    const { deviceIds, off_start, off_end } = req.body;
    const devices = await changeDeviceOffTimes({
      deviceIds,
      off_start,
      off_end,
    });
    res.sendResponse({ status: 1, devices });
  } catch (err) {
    res.sendError(err);
  }
});

module.exports = router;
