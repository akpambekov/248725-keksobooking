'use strict';

(function () {
  window.synchronizeFields = function (source, target, sourceData, targetData, syncFunc) {
    var selectedValue = null;
    var selectedIndex = null;

    if (typeof syncFunc === 'function') {
      source.addEventListener('change', function () {
        selectedValue = source.value;
        selectedIndex = sourceData.indexOf(selectedValue);
        syncFunc(target, targetData[selectedIndex]);
      });
    }
  };
}());
