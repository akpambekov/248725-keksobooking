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
  var address = document.querySelector('#address');
  var initialAddressesLeftValue = parseInt(getComputedStyle(window.mainPin).left, 10);
  var initialAddressesTopValue = parseInt(getComputedStyle(window.mainPin).top, 10);
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
      window.mainPin.style.left = initialAddressesLeftValue + 'px';
      window.mainPin.style.top = initialAddressesTopValue + 'px';
    } else {
      window.mainPin.style.left = result[0] - window.MAIN_PIN_HALF_WIDTH + 'px';
      window.mainPin.style.top = result[1] - window.MAIN_PIN_HEIGHT + 'px';
    }
  };
  window.setAddressValue(initialAddressesLeftValue + window.MAIN_PIN_HALF_WIDTH, initialAddressesTopValue + window.MAIN_PIN_HEIGHT);
  address.addEventListener('change', onAddressFieldChange);
})();
