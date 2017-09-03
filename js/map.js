'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 94;
  var MAIN_PIN_HALF_WIDTH = 76 / 2;
  var MAX_COORDINATES = {
    'X1': 0,
    'X2': 1120,
    'Y1': 50,
    'Y2': 570
  };
  window.isEscKeyCode = function (keyCode) {
    return keyCode === 27;
  };
  window.isEnterKeyCode = function (keyCode) {
    return keyCode === 13;
  };
  var mainPin = document.querySelector('.pin__main');
  var address = document.querySelector('#address');
  var addressesLeftValue = parseInt(getComputedStyle(mainPin).left, 10) + MAIN_PIN_HALF_WIDTH;
  var addressesTopValue = parseInt(getComputedStyle(mainPin).top, 10) + MAIN_PIN_HEIGHT;
  var setAddressValue = function (xValue, yValue) {
    address.value = 'x: ' + xValue + ' px, ' + 'y: ' + yValue + ' px';
  };
  var onAddressFieldFocusOut = function () {
    var arr = address.value.split(' ');
    var result = [];
    for (var i = 0; i < arr.length; i++) {
      var currentVal = parseInt(arr[i], 10);
      if (!isNaN(currentVal)) {
        result.push(currentVal);
      }
    }
    mainPin.style.left = result[0] - MAIN_PIN_HALF_WIDTH + 'px';
    mainPin.style.top = result[1] - MAIN_PIN_HEIGHT + 'px';
  };
  setAddressValue(addressesLeftValue, addressesTopValue);
  address.addEventListener('focusout', onAddressFieldFocusOut);

  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
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

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      mainPin.style.top = setLimitOnPinMoves(mainPin.offsetTop - shift.y, MAX_COORDINATES['Y1'], MAX_COORDINATES['Y2']);
      mainPin.style.left = setLimitOnPinMoves(mainPin.offsetLeft - shift.x, MAX_COORDINATES['X1'], MAX_COORDINATES['X2']);

      var addressesNewLeftValue = parseInt(mainPin.style.left, 10) + MAIN_PIN_HALF_WIDTH;
      var addressesNewTopValue = parseInt(mainPin.style.top, 10) + MAIN_PIN_HEIGHT;

      setAddressValue(addressesNewLeftValue, addressesNewTopValue);
    };
    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
})();
