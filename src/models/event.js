const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },

  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },

  roomTemp: { type: Number, required: true },
  targetTemp: { type: Number, required: true },
  prevTargetTemp: { type: Number },
  summer: {type: Boolean, default: false},

  actionType: { type: String, enum: ["set_temp", "turn_off", "turn_on"], default: "set_temp" },

  // Weather data (from API at that moment)
  weather: { type: mongoose.Schema.Types.Mixed, default: null },

  // Time-based features
  hourOfDay: { type: Number, min: 0, max: 23 },
  dayOfWeek: { type: Number, min: 0, max: 6 },
  isWeekend: { type: Boolean },
  isHoliday: { type: Boolean }
});

// Optional: auto-compute time features before saving
EventSchema.pre("save", function (next) {
  const date = new Date(this.timestamp);
  this.hourOfDay = date.getHours();
  this.dayOfWeek = date.getDay();
  this.isWeekend = this.dayOfWeek === 5 || this.dayOfWeek === 6;
  next();
});

module.exports = mongoose.model("Event", EventSchema);