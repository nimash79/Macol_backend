const { Report } = require("../models");
const { startOfDay, startOfWeek, startOfYear } = require('date-fns');

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

  switch (type) {
    case 'daily':
      startDate = startOfDay(now);
      groupFormat = { hour: { $hour: '$reportDate' } };
      outputLength = 24;
      break;
    case 'weekly':
      startDate = startOfWeek(now, { weekStartsOn: 6 }); // Saturday
      groupFormat = { day: { $dayOfWeek: '$reportDate' } }; // 1 (Sun) - 7 (Sat)
      outputLength = 7;
      break;
    case 'monthly':
      startDate = startOfYear(now);
      groupFormat = { month: { $month: '$reportDate' } }; // 1-12 (Jan-Dec)
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
      index = _id.month - 1;
    } else {
      index = _id.hour; // daily
    }
    if (index >= 0 && index < outputLength) {
      averages[index] = avgTemp.toFixed(0);
    }
  });

  return averages;
};

