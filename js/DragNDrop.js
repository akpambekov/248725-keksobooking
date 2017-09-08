'use strict';

(function () {
  var MAX_COORDINATES = {
    'X1': 0,
    'X2': 1120,
    'Y1': 50,
    'Y2': 570
  };
  var startCoords = {
    x: null,
    y: null
  };
  var setLimitOnPinMoves = function (argument, firstLimit, secondLimit) {
    if (argument > firstLimit && argument < secondLimit) {
      return argument + 'px';
    } else if (argument > firstLimit) {
      return secondLimit + 'px';
    } else {
      return firstLimit + 'px';
    }
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
    window.mainPin.style.top = setLimitOnPinMoves(window.mainPin.offsetTop - shift.y, MAX_COORDINATES['Y1'], MAX_COORDINATES['Y2']);
    window.mainPin.style.left = setLimitOnPinMoves(window.mainPin.offsetLeft - shift.x, MAX_COORDINATES['X1'], MAX_COORDINATES['X2']);
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
