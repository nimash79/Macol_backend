const mongoose = require("mongoose");

const { Event } = require("../models");

exports.addEvent = async ({
  deviceId,
  roomTemp,
  targetTemp,
  prevTargetTemp,
  summer,
  actionType,
  weather,
}) => {
  await Event.create({
    deviceId: new mongoose.Types.ObjectId(parseInt(deviceId)),
    roomTemp,
    targetTemp,
    prevTargetTemp,
    summer,
    actionType,
    weather,
  });
  return true;
};
