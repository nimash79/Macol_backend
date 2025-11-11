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
  isHoliday,
}) => {
  await Event.create({
    deviceId,
    roomTemp,
    targetTemp,
    prevTargetTemp,
    summer,
    actionType,
    weather,
    isHoliday,
  });
  return true;
};
