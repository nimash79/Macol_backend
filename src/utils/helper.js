exports.randomCode = () => {
  var min = 10000;
  var max = 90000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
};

exports.generateRandomDeviceId = () => {
  var min = 100000000000000;
  var max = 900000000000000;
  var num = Math.floor(Math.random() * min) + max;
  return num;
}

exports.getRefreshRateType = (type) => {
    switch (type) {
      case 1:
        return 1;
      case 2:
        return 3;
      case 3:
        return 5;
      case 4:
        return 15;
      case 5:
        return 30;
      case 6:
        return 60;
      case 7:
        return 120;
      case 8:
        return 360;
      case 9:
        return 720;
      case 10:
        return 1440;
    }
  };
