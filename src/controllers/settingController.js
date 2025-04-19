const { Setting } = require('../models');

exports.getSettings = async () => {
    const settings = await Setting.find();
    return settings;
}