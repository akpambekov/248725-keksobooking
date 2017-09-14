'use strict';

(function () {
  var PIN_HEIGHT = 75;
  var PIN_HALF_WIDTH = 56 / 2;
  var TAB_INDEX_VALUE = '0';

  var dialog = document.querySelector('.dialog');
  var closeButton = dialog.querySelector('.dialog__close');
  var tokyoFilters = document.querySelector('.tokyo__filters');
  var type = tokyoFilters.querySelector('#housing_type');
  var price = tokyoFilters.querySelector('#housing_price');
  var roomNumber = tokyoFilters.querySelector('#housing_room-number');
  var guestsNumber = tokyoFilters.querySelector('#housing_guests-number');
  var initialPinsOnMap = null;
  var activePin = null;
  var usersData = [];

  var drawPins = function (data) {
    var fragmentForPins = document.createDocumentFragment();
    var pinMap = document.querySelector('.tokyo__pin-map');

    for (var i = 0; i < data.length; i++) {
      var pin = document.createElement('div');
      pin.className = 'pin';
      pin.style.top = data[i].location.y - PIN_HEIGHT + 'px';
      pin.style.left = data[i].location.x - PIN_HALF_WIDTH + 'px';
      pin.setAttribute('tabindex', TAB_INDEX_VALUE);

      var pinImg = document.createElement('img');
      pinImg.className = 'rounded';
      pinImg.style.height = '40px';
      pinImg.style.width = '40px';
      pinImg.setAttribute('src', data[i].author.avatar);

      pin.appendChild(pinImg);
      fragmentForPins.appendChild(pin);
    }

    pinMap.appendChild(fragmentForPins);
  };

  var getThreeRandomArr = function (arr) {
    var indexes = [];
    var randomValues = [];

    while (randomValues.length < 3) {
      var index = Math.floor(Math.random() * arr.length);

      if (indexes.indexOf(index) === -1) {
        randomValues.push(arr[index]);
        indexes.push(index);
      }
    }

    return randomValues;
  };

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

  var deletePinsOnMap = function () {
    var deletedElements = getPinsWithoutMainPin();
    for (var i = 0; i < deletedElements.length; i++) {
      deletedElements[i].remove();
    }
  };

  var hideDialog = function () {
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
    dialog.classList.add('hidden');
  };

  var onPinFocus = function (a, elem, data) {
    elem.addEventListener('keydown', function (e) {
      if (window.isEnterKeyCode(e.keyCode)) {
        dialog.classList.remove('hidden');
        window.createActivePinInfo(data[a]);
      }
    });
  };

  var onDocumentPressEsc = function (e) {
    if (window.isEscKeyCode(e.keyCode)) {
      hideDialog();
    }
  };

  var showCard = function (data) {
    return function (e) {
      window.createActivePinInfo(data);
      dialog.classList.remove('hidden');
      if (activePin) {
        activePin.classList.remove('pin--active');
      }
      activePin = e.currentTarget;
      activePin.classList.add('pin--active');
    };
  };

  var addEventsForMultipleElems = function (elems, data) {
    for (var i = 0; i < elems.length; i++) {
      elems[i].addEventListener('click', showCard(data[i]));
      elems[i].addEventListener('focus', onPinFocus(i, elems[i], data));
    }
  };

  var onDialogCloseButtonClick = function () {
    hideDialog();
  };

  var addEventsOnPage = function (data) {
    usersData = usersData.concat(data);
    initialPinsOnMap = getThreeRandomArr(usersData, 3);

    drawPins(initialPinsOnMap);
    addEventsForMultipleElems(getPinsWithoutMainPin(), initialPinsOnMap);
    document.addEventListener('keydown', onDocumentPressEsc);
    closeButton.addEventListener('click', onDialogCloseButtonClick);
  };

  var getValuesFromCollection = function (collection, val) {
    var result = [];

    for (var i = 0; i < collection.length; i++) {
      result.push(collection[i][val]);
    }

    return result;
  };

  var filterData = function () {
    var checkedFeatures = tokyoFilters.querySelectorAll('#housing_features input:checked');
    var inputsVal = {
      type: type.value,
      price: price.value,
      rooms: roomNumber.value,
      guests: guestsNumber.value,
      features: getValuesFromCollection(checkedFeatures, 'value')
    };

    var filteredUsersData = usersData.filter(function (item) {
      return window.isComplianceFilter(inputsVal, item.offer);
    });

    deletePinsOnMap();
    drawPins(filteredUsersData);

    var newPinsOnMap = getPinsWithoutMainPin();

    addEventsForMultipleElems(newPinsOnMap, filteredUsersData);
    document.addEventListener('keydown', onDocumentPressEsc);
    closeButton.addEventListener('click', onDialogCloseButtonClick);
  };

  window.backend.load(addEventsOnPage, window.showErrorMessage);

  var onTokyoFormChange = function () {
    window.debounce(filterData);
  };

  tokyoFilters.addEventListener('change', onTokyoFormChange);
})();


