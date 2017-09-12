'use strict';

(function () {
  window.MAIN_PIN_HEIGHT = 94;
  window.MAIN_PIN_HALF_WIDTH = 76 / 2;
  window.isEscKeyCode = function (keyCode) {
    return keyCode === 27;
  };
  window.isEnterKeyCode = function (keyCode) {
    return keyCode === 13;
  };
  window.mainPin = document.querySelector('.pin__main');
  var mainPinStyle = getComputedStyle(window.mainPin);
  var address = document.querySelector('#address');
  window.defaultMainPinPosition = {
    left: parseInt(mainPinStyle.left, 10),
    top: parseInt(mainPinStyle.top, 10)
  };
  window.mainPinPositionForAddressField = {
    left: window.defaultMainPinPosition.left + window.MAIN_PIN_HALF_WIDTH,
    top: window.defaultMainPinPosition.top + window.MAIN_PIN_HEIGHT
  };

  var onAddressFieldChange = function () {
    var arr = address.value.split(' ');
    var result = [];

    for (var i = 0; i < arr.length; i++) {
      var currentVal = parseInt(arr[i], 10);
      if (!isNaN(currentVal)) {
        result.push(currentVal);
      }
    }

    if (result.length < 2) {
      window.mainPin.style.left = window.defaultMainPinPosition.left + 'px';
      window.mainPin.style.top = window.defaultMainPinPosition.top + 'px';
    } else {
      window.mainPin.style.left = result[0] - window.MAIN_PIN_HALF_WIDTH + 'px';
      window.mainPin.style.top = result[1] - window.MAIN_PIN_HEIGHT + 'px';
    }
  };

  window.setAddressValue(window.mainPinPositionForAddressField.left, window.mainPinPositionForAddressField.top);
  address.addEventListener('change', onAddressFieldChange);
})();
