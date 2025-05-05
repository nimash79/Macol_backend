const { Report } = require("../models");
const { startOfDay, startOfWeek, startOfYear } = require('date-fns');
const ExcelJS = require('exceljs');
const moment = require('moment-jalaali');
moment.loadPersian({ dialect: 'persian-modern' });

exports.addReport = async ({ deviceId, temperature, battery }) => {
    await Report.create({
        deviceId,
        temperature,
        battery,
    });
    return true;
}

exports.getReports = async ({ deviceId, type }) => {
  const now = new Date();
  let startDate;
  let groupFormat;
  let outputLength;
  const timezone = 'Asia/Tehran'; // Replace with your local timezone (e.g., 'America/New_York')

  switch (type) {
    case 'daily':
      startDate = startOfDay(now);
      groupFormat = {
        hour: {
          $hour: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 24;
      break;
    case 'weekly':
      startDate = startOfWeek(now, { weekStartsOn: 6 }); // Saturday
      groupFormat = {
        day: {
          $dayOfWeek: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 7;
      break;
    case 'monthly':
      startDate = startOfYear(now);
      groupFormat = {
        month: {
          $month: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 12;
      break;
    default:
      throw new Error('Invalid report type');
  }

  const pipeline = [
    {
      $match: {
        deviceId,
        reportDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: groupFormat,
        avgTemp: { $avg: '$temperature' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ];

  const results = await Report.aggregate(pipeline);

  // Init with 0s
  const averages = Array(outputLength).fill(0);

  // Correct index extraction
  results.forEach(({ _id, avgTemp }) => {    
    let index = Object.values(_id)[0] - (type === 'daily' ? 0 : 1); // adjust to 0-based index
    if (type === 'weekly') {
      index = _id.day % 7; // Saturday (7) → 0, Sunday (1) → 1, ..., Friday (6) → 6
    } else if (type === 'monthly') {
      const sampleDate = moment().month(_id.month - 1).startOf('month');
      index = sampleDate.jMonth();
    } else {
      index = _id.hour; // daily
    }
    if (index >= 0 && index < outputLength) {
      averages[index] = avgTemp.toFixed(0);
    }
  });

  return averages;
};

exports.exportReport = async ({ deviceIds, type }) => {
  const now = new Date();
  let startDate;
  let groupFormat;
  let outputLength;
  const timezone = 'Asia/Tehran'; // Replace with your local timezone

  // Validate that deviceIds is an array
  if (!Array.isArray(deviceIds) || deviceIds.length === 0) {
    throw new Error('Device IDs must be an array and cannot be empty');
  }

  switch (type) {
    case 'daily':
      startDate = startOfDay(now);
      groupFormat = {
        hour: {
          $hour: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 24;
      break;
    case 'weekly':
      startDate = startOfWeek(now, { weekStartsOn: 6 }); // Saturday
      groupFormat = {
        day: {
          $dayOfWeek: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 7;
      break;
    case 'monthly':
      startDate = startOfYear(now);
      groupFormat = {
        month: {
          $month: {
            date: '$reportDate',
            timezone
          }
        }
      };
      outputLength = 12;
      break;
    default:
      throw new Error('Invalid report type');
  }

  const pipeline = [
    {
      $match: {
        deviceId: { $in: deviceIds }, // Match any of the device IDs
        reportDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: { deviceId: '$deviceId', groupFormat }, // Group by deviceId and the chosen date group
        avgTemp: { $avg: '$temperature' }
      }
    },
    {
      $sort: { '_id.deviceId': 1, '_id.groupFormat': 1 } // Sort by deviceId and date group
    }
  ];

  const results = await Report.aggregate(pipeline);

  // Create Excel workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('All Devices Report'); // Single sheet for all devices

  // Define columns for the sheet
  worksheet.columns = [
    { header: 'Device ID', key: 'deviceId', width: 20 },
    { header: type === 'daily' ? 'Hour' : type === 'weekly' ? 'Day' : 'Month', key: 'label', width: 15 },
    { header: 'Avg Temp (°C)', key: 'avgTemp', width: 20 }
  ];

  // Add rows for each time period (hour, day, or month) and device
  results.forEach(({ _id, avgTemp }) => {
    const { deviceId, groupFormat } = _id;
    let index = Object.values(groupFormat)[0] - (type === 'daily' ? 0 : 1); // Adjust to 0-based index
    if (type === 'weekly') {
      index = groupFormat.day % 7; // Saturday (7) → 0, Sunday (1) → 1, ..., Friday (6) → 6
    } else if (type === 'monthly') {
      index = groupFormat.month - 1;
    } else {
      index = groupFormat.hour; // Daily
    }

    // Convert to Persian month if type is 'monthly'
    let label;
    if (type === 'daily') {
      label = `${index}:00`; // Hourly report
    } else if (type === 'weekly') {
      label = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنج شنبه', 'جمعه'][index];
    } else if (type === 'monthly') {
      // Convert month index to Persian month using moment-jalaali
      label = moment().month(index).format('jMMMM');
    }

    worksheet.addRow({
      deviceId, // Add deviceId to the row
      label,    // Use Persian month or the appropriate label
      avgTemp: avgTemp.toFixed(0)
    });
  });

  // Generate the Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  return buffer;
};
