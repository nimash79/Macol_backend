const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
    title: { type: String, required: true, minLength: 4, maxLength: 200 },
    value: { type: Number, required: true },
    description: { type: String, required: false, minLength: 4, maxLength: 500 },
});

module.exports = mongoose.model('Setting', SettingSchema);