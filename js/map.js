'use strict';

(function () {
  window.isEscKeyCode = function (keyCode) {
    return keyCode === 27;
  };
  window.isEnterKeyCode = function (keyCode) {
    return keyCode === 13;
  };
})();
