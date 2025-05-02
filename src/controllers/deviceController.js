const { Device } = require('../models');
const { randomCode } = require('../utils/helper');

exports.addDevice = async ({ userId, mobile, count }) => {
    const currentDevices = await Device.find({ userId }).select("deviceId name");
    const mobileWithout0 = mobile.substring(1);
    let number = 1;
    const promises = [];
    for (let i = 0; i < count; i++) {
        // generate device id
        let randomNumber = randomCode().toString();
        let deviceId = mobileWithout0 + randomNumber;
        while (currentDevices.map(d => d.deviceId).includes(deviceId)) {
            randomNumber = randomCode().toString();
            deviceId = mobileWithout0 + randomNumber;
        }
        // generate name
        const prefix = "دستگاه ";
        let name = prefix + number;
        while (currentDevices.map(d => d.name).includes(name)) {
            number++;
            name = prefix + number;
        }
        number++;
        const promise = Device.create({
            userId,
            deviceId,
            name,
            temperature: 15,
            value: 15,
            battery: 100
        });
        promises.push(promise);
    }
    const devices = await Promise.all(promises);
    return devices;
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
    const exists = await Device.exists({ userId, name });
    if (exists) return 2;
    await Device.updateOne({ deviceId }, { name });
    return 1;
}

exports.changeDeviceOnStatus = async ({ deviceId, on }) => {
    await Device.updateOne({ deviceId }, { on });
    return 1;
}

exports.changeDeviceValue = async ({ deviceIds, value, economy }) => {
    await Device.updateMany(
        { deviceId: { $in: deviceIds } },
        { $set: { value, economy } }
    );
};

exports.changeDeviceSettings = async ({ deviceIds, economy_value, economy_start, economy_end }) => {
    await Device.updateMany(
        { deviceId: { $in: deviceIds } },
        { $set: { economy_value, economy_start, economy_end } }
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

exports.deleteDevice = async ({ deviceId }) => {
    await Device.deleteOne({ deviceId });
}
