'use strict';

(function () {
  var PIN_HEIGHT = 75;
  var PIN_HALF_WIDTH = 56 / 2;
  var TAB_INDEX_VALUE = '0';
  var drawPins = function () {
    var fragmentForPins = document.createDocumentFragment();
    var pinMap = document.querySelector('.tokyo__pin-map');

    for (var i = 0; i < window.USERS_NUMBER; i++) {
      var pin = document.createElement('div');
      pin.className = 'pin';
      pin.style.top = window.usersData[i].location.y - PIN_HEIGHT + 'px';
      pin.style.left = window.usersData[i].location.x - PIN_HALF_WIDTH + 'px';
      pin.setAttribute('tabindex', TAB_INDEX_VALUE);

      var pinImg = document.createElement('img');
      pinImg.className = 'rounded';
      pinImg.style.height = '40px';
      pinImg.style.width = '40px';
      pinImg.setAttribute('src', window.usersData[i].author.avatar);

      pin.appendChild(pinImg);
      fragmentForPins.appendChild(pin);
    }

    pinMap.appendChild(fragmentForPins);
  };

  drawPins();

  var dialog = document.querySelector('.dialog');
  var closeButton = dialog.querySelector('.dialog__close');
  var activePin = null;
  var getPinsWithoutMainPin = function () {
    var pins = document.querySelectorAll('.pin');
    var resultPins = [];
    for (var i = 0; i < pins.length; i++) {
      if (!(pins[i].classList.contains('pin__main'))) {
        resultPins.push(pins[i]);
      }
    }
    return resultPins;
  };
  var hideDialog = function () {
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
    dialog.classList.add('hidden');
  };

  var onPinFocus = function (a, elem) {
    elem.addEventListener('keydown', function (e) {
      if (window.isEnterKeyCode(e.keyCode)) {
        dialog.classList.remove('hidden');
        window.createActivePinInfo(window.usersData[a]);
      }
    });
  };

  var onPinClick = function (x) {
    return function (e) {
      window.createActivePinInfo(window.usersData[x]);
      dialog.classList.remove('hidden');
      if (activePin) {
        activePin.classList.remove('pin--active');
      }
      activePin = e.currentTarget;
      activePin.classList.add('pin--active');
    };
  };

  var onDocumentPressEsc = function (e) {
    if (window.isEscKeyCode(e.keyCode)) {
      hideDialog();
    }
  };

  var addEventsForMultipleElems = function (elems) {
    for (var i = 0; i < elems.length; i++) {
      elems[i].addEventListener('click', onPinClick(i));
      elems[i].addEventListener('focus', onPinFocus(i, elems[i]));
    }
  };

  var onCloseButtonClick = function () {
    hideDialog();
  };

  var addEventsOnPage = function () {
    addEventsForMultipleElems(getPinsWithoutMainPin());
    document.addEventListener('keydown', onDocumentPressEsc);
    closeButton.addEventListener('click', onCloseButtonClick);
  };

  addEventsOnPage();
})();
