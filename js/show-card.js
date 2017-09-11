'use strict';

(function () {
  window.activePin = null;
  window.showCard = function (data) {
    return function (e) {
      window.createActivePinInfo(data);
      window.dialog.classList.remove('hidden');
      if (window.activePin) {
        window.activePin.classList.remove('pin--active');
      }
      window.activePin = e.currentTarget;
      window.activePin.classList.add('pin--active');
    };
  };
})();
