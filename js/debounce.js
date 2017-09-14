'use strict';

(function () {
  var DEBOUNCE_TIME = 500;
  var lastTimeout;

  window.debounce = function (func) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(func, DEBOUNCE_TIME);
  };
})();
