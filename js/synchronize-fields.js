'use strict';

(function () {
  // Здесь долго думал, но ничего корректного придумать не смог и оставил числительное в названии аргументов
  window.synchronizeFields = function (firstField, secondField, firstData, secondData, syncFunc) {
    var selectedValue = null;
    var selectedIndex = null;

    if (typeof syncFunc === 'function') {
      firstField.addEventListener('change', function () {
        selectedValue = firstField.value;
        selectedIndex = firstData.indexOf(selectedValue);
        syncFunc(secondField, secondData[selectedIndex]);
      });
    }
  };
}());
