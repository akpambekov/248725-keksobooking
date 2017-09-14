'use strict';

(function () {
  var COORDINATES_LIMIT = {
    'MIN_X': 0,
    'MAX_X': 1120,
    'MIN_Y': 50,
    'MAX_Y': 570
  };
  var startCoords = {
    x: null,
    y: null
  };

  var setLimitOnPinMoves = function (valueInRange, minLimit, maxLimit) {
    if (valueInRange > minLimit && valueInRange < maxLimit) {
      return valueInRange;
    } else if (valueInRange > minLimit) {
      return maxLimit;
    }

    return minLimit;
  };

  var onMouseMove = function (event) {
    event.preventDefault();
    var shift = {
      x: startCoords.x - event.clientX,
      y: startCoords.y - event.clientY
    };
    startCoords = {
      x: event.clientX,
      y: event.clientY
    };
    window.mainPin.style.top = setLimitOnPinMoves(window.mainPin.offsetTop - shift.y, COORDINATES_LIMIT['MIN_Y'], COORDINATES_LIMIT['MAX_Y']) + 'px';
    window.mainPin.style.left = setLimitOnPinMoves(window.mainPin.offsetLeft - shift.x, COORDINATES_LIMIT['MIN_X'], COORDINATES_LIMIT['MAX_X']) + 'px';
    var addressesNewLeftValue = parseInt(window.mainPin.style.left, 10) + window.MAIN_PIN_HALF_WIDTH;
    var addressesNewTopValue = parseInt(window.mainPin.style.top, 10) + window.MAIN_PIN_HEIGHT;

    window.setAddressValue(addressesNewLeftValue, addressesNewTopValue);
  };

  var onMouseUp = function (event) {
    event.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  var onMainPinMouseDown = function (event) {
    event.preventDefault();
    startCoords = {
      x: event.clientX,
      y: event.clientY
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
