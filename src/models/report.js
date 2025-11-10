const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    deviceId: { type: String, required: true },
    temperature: { type: Number, required: true },
    battery: { type: Number, required: true },
    reportDate: {type: Date, default: Date.now},
    summer: {type: Boolean, default: false},
    weather: { type: mongoose.Schema.Types.Mixed, default: null },
});

module.exports = mongoose.model('Report', ReportSchema);