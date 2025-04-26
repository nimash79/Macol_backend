const { Report } = require("../models");

exports.addReport = async ({ deviceId, temperature, battery }) => {
    await Report.create({
        deviceId,
        temperature,
        battery,
    });
    return true;
}