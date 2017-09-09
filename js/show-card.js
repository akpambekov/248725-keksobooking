'use strict';

(function () {
  window.activePin = null;
  window.showCard = function (x) {
    return function (e) {
      window.createActivePinInfo(window.usersData[x]);
      window.dialog.classList.remove('hidden');
      if (window.activePin) {
        window.activePin.classList.remove('pin--active');
      }
      window.activePin = e.currentTarget;
      window.activePin.classList.add('pin--active');
    };
  };
})();
