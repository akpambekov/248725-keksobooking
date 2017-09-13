'use strict';

(function () {
  var PRICE_RANGE = {
    HIGH: {
      MIN: 50001,
      MAX: Infinity
    },
    MIDDLE: {
      MIN: 10000,
      MAX: 50000
    },
    LOW: {
      MIN: 0,
      MAX: 9999
    }
  };

  var isPriceInRange = function (value, range) {
    return value >= PRICE_RANGE[range].MIN && value <= PRICE_RANGE[range].MAX;
  };

  var isArrIncudeArr = function (source, target) {
    return source.every(function (value) {
      return target.indexOf(value) !== -1;
    });
  };

  window.isComplianceFilter = function (input, data) {
    var inputs = Object.keys(input);

    var findCompliance = function (val) {
      if (input[val] === 'any') {
        return true;
      } else if (val === 'price') {
        return isPriceInRange(data[val], input[val].toUpperCase());
      } else if (typeof input[val] === 'string') {
        return input[val] === String(data[val]);
      } else if (input[val] instanceof Array) {
        return isArrIncudeArr(input[val], data[val]);
      }

      return false;
    };

    return inputs.every(findCompliance);
  };
}) ();
