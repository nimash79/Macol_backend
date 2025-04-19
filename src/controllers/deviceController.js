const { Device } = require('../models');

exports.createDevice = async ({ userId }) => {
    await Device.create({
        userId,
    });
}

exports.existsDevice = async ({ deviceId }) => {
    return await Device.exists({ deviceId });
}

exports.getDevicesOfUser = async ({ userId }) => {
    const devices = await Device.find({ userId });
    return devices;
}

exports.getDevice = async ({ deviceId }) => {
    const device = await Device.findOne({ deviceId });
    return device;
}

exports.getSelectedDevices = async ({ deviceIds }) => {
    const devices = await Device.find({ deviceId: { $in: deviceIds } });
    return devices;
}

exports.changeDeviceName = async ({ userId, deviceId, name }) => {
    const exists = await Device.exists({userId, name});
    if (exists) return 2;
    await Device.updateOne({ deviceId }, { name });
    return 1;
}

exports.changeDeviceValue = async ({ deviceIds, value, economy }) => {
    await Device.updateMany(
        { deviceId: { $in: deviceIds } },
        { $set: { value, economy } }
    );
};

exports.getAndUpdateDevice = async ({ deviceId, temperature, battery }) => {
    const device = await Device.findOne({ deviceId });
    if (!device) return null;
    device.temperature = temperature;
    device.battery = battery;
    const now = Date.now();
    device.lastData = now;
    await device.save();
    if (device.economy && (new Date(now).getHours() >= device.economy_start || new Date(now).getHours() < device.economy_end))
        device.value = device.economy_value;
    return device;
}
