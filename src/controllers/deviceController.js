const { Device } = require('../models');
const { randomCode, generateRandomDeviceId } = require('../utils/helper');

exports.addDevice = async ({ userId, mobile, count }) => {
    const currentDevices = await Device.find({}).select("deviceId");
    const currentDevicesOfUser = await Device.find({ userId }).select("name");
    let number = 1;
    const promises = [];
    for (let i = 0; i < count; i++) {
        // generate device id
        let deviceId = generateRandomDeviceId().toString();
        while (currentDevices.map(d => d.deviceId).includes(deviceId))
            deviceId = generateRandomDeviceId().toString();
        // generate name
        const prefix = "دستگاه ";
        let name = prefix + number;
        while (currentDevicesOfUser.map(d => d.name).includes(name)) {
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
    if (!Array.isArray(deviceIds))
        deviceIds = [deviceIds];
    const devices = await Device.aggregate([
        {
            $match: {
                deviceId: { $in: deviceIds }
            }
        },
        {
            $lookup: {
                from: "reports",
                let: { device_id: "$deviceId" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$deviceId", "$$device_id"] }
                        }
                    },
                    {
                        $sort: { reportDate: -1 }
                    },
                    {
                        $skip: 1
                    },
                    {
                        $limit: 1
                    }
                ],
                as: "secondReport"
            }
        }
    ]);
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
    const devices = await Device.find({ deviceId: { $in: deviceIds } });
    return devices;
};

exports.getAndUpdateDevice = async ({ deviceId, temperature, battery }) => {
    const device = await Device.findOne({ deviceId });
    if (!device) return null;
    device.temperature = temperature;
    device.battery = battery;
    const now = new Date();
    device.lastData = now;
    await device.save();
    if (device.economy && (now.getHours() >= device.economy_start && now.getHours() < device.economy_end))
        device.value = device.economy_value;
    // check for off dates
    let safeOffDates = true;
    device.off_dates.forEach(date => {
        date = new Date(date).getDate();
        if (date == now.getDate()) safeOffDates = false;
    })
    device.on = device.on && safeOffDates;
    return device;
}

exports.deleteDevices = async ({ deviceIds }) => {
    await Device.deleteMany({ deviceId: { $in: deviceIds } });
}

exports.changeCalibration = async ({ deviceIds, calibration }) => {
    await Device.updateMany(
        { deviceId: { $in: deviceIds } },
        { $set: { calibration } }
    );
    const devices = await Device.find({ deviceId: { $in: deviceIds } });
    return devices;
}

exports.changeDeviceOffDates = async ({ deviceIds, off_dates }) => {
    await Device.updateMany(
        { deviceId: { $in: deviceIds } },
        { $set: { off_dates } }
    );
    const devices = await Device.find({ deviceId: { $in: deviceIds } });
    return devices;
}