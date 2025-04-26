const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    temperature: { type: Number, required: true },
    battery: { type: Number, required: true },
    reportDate: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Report', ReportSchema);