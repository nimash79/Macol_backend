const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true, minLength: 4, maxLength: 200 },
    value: { type: Number, required: true },
    temperature: { type: Number, required: true },
    calibration: { type: Number, default: 0 },
    battery: { type: Number, required: true },
    on: { type: Boolean, default: false },
    economy: { type: Boolean, default: false },
    economy_value: { type: Number, default: 0 },
    economy_start: { type: Number, default: 0 },
    economy_end: { type: Number, default: 0 },
    openedDoor: { type: Boolean, default: false },
    lastData: { type: Date, default: Date.now },
    createDate: { type: Date, default: Date.now },
    off_dates: { type: [Date], default: [] },
    summer: { type: Boolean, default: false },
    refreshRateType: { type: Number, default: 5 },
    wifi: { type: Boolean, default: true },
    reset: { type: Boolean, default: false },
    off_start: { type: Number, default: 0 },
    off_end: { type: Number, default: 0 },
});

module.exports = mongoose.model('Device', DeviceSchema);