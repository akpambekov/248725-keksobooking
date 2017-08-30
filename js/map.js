'use strict';

var PIN_HEIGHT = 75;
var PIN_HALF_WIDTH = 56 / 2;
var TAB_INDEX_VALUE = '0';

// начальные данные

var usersNumber = 8;
var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var types = ['flat', 'house', 'bungalo'];
var times = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var priceRange = {
  'min': 1000,
  'max': 1000000
};
var roomsQuantity = {
  'min': 1,
  'max': 5
};
var guestsQuantity = {
  'min': 1,
  'max': 12
};
var coordinatesForX = {
  'min': 300,
  'max': 900
};
var coordinatesForY = {
  'min': 100,
  'max': 500
};
var usersData = [];
var buildingType = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

// вспомогательные функции
var getUserID = function (numb) {
  return '0' + numb;
};

var randomSort = function (arr) {
  var currentIndex = arr.length;
  var temporaryValue = null;
  var randomIndex = null;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }
  return arr;
};

var getRandomValueInRange = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getUserAvatar = function (str) {
  return 'img/avatars/user' + str + '.png';
};

var getUserTitle = function (arr) {
  var a = randomSort(arr);
  return a.pop();
};

var getRandomValueFromArray = function (arr) {
  var randomValue = getRandomValueInRange(0, arr.length - 1);
  return arr[randomValue];
};

var getArrayWithRandomLengthAndValues = function (arr) {
  var arrCopy = [];
  for (var i = 0; i < arr.length; i++) {
    arrCopy[i] = arr[i];
  }
  randomSort(arrCopy);
  var arrayLength = getRandomValueInRange(0, arr.length);
  return arrCopy.splice(0, arrayLength);
};

// основная функция для получения пользовательских данных

var getUserData = function (number) {
  var data = {
    'author': {
      'avatar': getUserAvatar(getUserID(number))
    },

    'offer': {
      'title': getUserTitle(titles),
      'price': getRandomValueInRange(priceRange.min, priceRange.max),
      'type': getRandomValueFromArray(types),
      'rooms': getRandomValueInRange(roomsQuantity.min, roomsQuantity.max),
      'guests': getRandomValueInRange(guestsQuantity.min, guestsQuantity.max),
      'checkin': getRandomValueFromArray(times),
      'checkout': getRandomValueFromArray(times),
      'features': getArrayWithRandomLengthAndValues(featuresList),
      'description': '',
      'photos': []
    },

    'location': {
      'x': getRandomValueInRange(coordinatesForX.min, coordinatesForX.max),
      'y': getRandomValueInRange(coordinatesForY.min, coordinatesForY.max)
    }
  };

  data.offer.address = data.location.x + ', ' + data.location.y;

  return data;
};

var drawPins = function () {
  var fragmentForPins = document.createDocumentFragment();
  var pinMap = document.querySelector('.tokyo__pin-map');

  for (var i = 0; i < usersNumber; i++) {
    usersData.push(getUserData(i + 1));

    var pin = document.createElement('div');
    pin.className = 'pin';
    pin.style.top = usersData[i].location.y - PIN_HEIGHT + 'px';
    pin.style.left = usersData[i].location.x - PIN_HALF_WIDTH + 'px';
    pin.setAttribute('tabindex', TAB_INDEX_VALUE);

    var pinImg = document.createElement('img');
    pinImg.className = 'rounded';
    pinImg.style.height = '40px';
    pinImg.style.width = '40px';
    pinImg.setAttribute('src', usersData[i].author.avatar);

    pin.appendChild(pinImg);
    fragmentForPins.appendChild(pin);
  }

  pinMap.appendChild(fragmentForPins);
};
var createActivePinInfo = function (data) {
  var userInfoTemplate = document.querySelector('#lodge-template').content;
  var activeUserInfo = userInfoTemplate.cloneNode(true);
  var activeUserTitle = activeUserInfo.querySelector('.lodge__title');
  var activeUserAddress = activeUserInfo.querySelector('.lodge__address');
  var activeUserPrice = activeUserInfo.querySelector('.lodge__price');
  var activeUserType = activeUserInfo.querySelector('.lodge__type');
  var activeUserGuests = activeUserInfo.querySelector('.lodge__rooms-and-guests');
  var activeUserCheckin = activeUserInfo.querySelector('.lodge__checkin-time');
  var activeUserFeatures = activeUserInfo.querySelector('.lodge__features');
  var activeUserAvatar = document.querySelector('.dialog__title img');
  var replacedElement = document.querySelector('.dialog__panel');
  var parentElement = document.querySelector('#offer-dialog');
  var fragmentForFeatures = document.createDocumentFragment();
  var activeUserDscr = activeUserInfo.querySelector('.lodge__description');
  activeUserTitle.textContent = data.offer.title;
  activeUserAddress.textContent = data.offer.address;
  activeUserPrice.textContent = data.offer.price + ' \u20BD/ночь';
  activeUserType.textContent = buildingType[data.offer.type];
  activeUserGuests.textContent = 'Для ' + data.offer.guests + ' гостей в ' + data.offer.rooms + ' комнатах';
  activeUserCheckin.textContent = 'Заезд после ' + data.offer.checkin + ', выезд до ' + data.offer.checkout;

  for (var count = 0; count < data.offer.features.length; count++) {
    var feature = document.createElement('span');
    feature.className = 'feature__image feature__image--' + data.offer.features[count];
    fragmentForFeatures.appendChild(feature);
  }

  activeUserFeatures.appendChild(fragmentForFeatures);
  activeUserDscr.textContent = data.offer.description;
  activeUserAvatar.setAttribute('src', data.author.avatar);
  parentElement.replaceChild(activeUserInfo, replacedElement);
};

drawPins();
createActivePinInfo(usersData[0]);

// навешивание событий для пинов

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

var isEscKeyCode = function (keyCode) {
  return keyCode === 27;
};

var isEnterKeyCode = function (keyCode) {
  return keyCode === 13;
};

var hideDialog = function () {
  if (activePin) {
    activePin.classList.remove('pin--active');
  }
  dialog.classList.add('hidden');
};

var onPinFocus = function (a, elem) {
  elem.addEventListener('keydown', function (e) {
    if (isEnterKeyCode(e.keyCode)) {
      dialog.classList.remove('hidden');
      createActivePinInfo(usersData[a]);
    }
  });
};

var onPinClick = function (x) {
  return function (e) {
    createActivePinInfo(usersData[x]);
    dialog.classList.remove('hidden');
    if (activePin) {
      activePin.classList.remove('pin--active');
    }
    activePin = e.currentTarget;
    activePin.classList.add('pin--active');
  };
};

var onDocumentPressEsc = function (e) {
  if (isEscKeyCode(e.keyCode)) {
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

// валидация формы

var mainForm = document.forms[1];
var addressField = mainForm.elements.address;
var titleField = mainForm.elements.title;
var priceField = mainForm.elements.price;
var typeField = mainForm.elements.type;
var timeInField = mainForm.elements.timein;
var timeOutField = mainForm.elements.timeout;
var roomsField = mainForm.elements.rooms;
var capacityField = mainForm.elements.capacity;
var submitBtn = mainForm.querySelector('.form__submit');

var mainFormAttr = {
  'method': 'POST',
  'action': 'https://1510.dump.academy/keksobooking',
  'enctype': 'multipart/form-data'
};
var addressFieldAtrr = {
  'required': 'true'
};
var titleFieldAtrr = {
  'required': 'true',
  'minlength': '30',
  'maxlength': '100'
};
var priceFieldAtrr = {
  'required': 'true',
  'type': 'number',
  'min': '0',
  'max': '1000000',
  'value': '1000'
};
var typePrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};
var room = {
  '0': [1],
  '1': [2, 1],
  '2': [3, 2, 1],
  '3': [0]
};

var getFormElements = function () {
  var formElements = [];
  var inputs = mainForm.querySelectorAll('input');
  var selects = mainForm.querySelectorAll('select');
  for (var i = 0; i < inputs.length; i++) {
    formElements.push(inputs[i]);
  }
  for (i = 0; i < selects.length; i++) {
    formElements.push(selects[i]);
  }
  return formElements;
};

var formElements = getFormElements();

var setAttrOnElem = function (elem, obj) {
  for (var attrName in obj) {
    if ({}.hasOwnProperty.call(obj, attrName)) {
      elem.setAttribute(attrName, obj[attrName]);
    }
  }
};

var onTypeFieldChange = function () {
  priceField.style.border = 'none';
  priceField.setAttribute('min', '' + typePrice[typeField.value]);
};

var onTimeFieldChange = function (input) {
  return function (e) {
    input.value = e.target.value;
  };
};

var undisableSelect = function (elem) {
  elem.disabled = false;
};

var disableSelect = function (elem) {
  elem.disabled = true;
};

var isElemOnArray = function (arr, elem) {
  var searchingResult = arr.indexOf(elem);
  return !(searchingResult === -1);
};

// Не уверен в корректности названии для функции
var setDependenceForCapacityAndRoomsField = function () {
  for (var guests in room) {
    if (roomsField.options[guests].selected) {
      for (var j = 0; j < capacityField.options.length; j++) {
        if (isElemOnArray(room[guests], parseInt(capacityField.options[j].value, 10))) {
          undisableSelect(capacityField.options[j]);
        } else {
          disableSelect(capacityField.options[j]);
        }
        if (room[guests][0] === parseInt(capacityField.options[j].value, 10)) {
          capacityField.options[j].selected = true;
        }
      }
    }
  }
};

var validationCheck = function (e) {
  var formIsNotValid = false;
  for (var i = 0; i < formElements.length; i++) {
    if (formElements[i].checkValidity() === false) {
      formElements[i].style.border = '2px solid red';
      formIsNotValid = true;
    }
  }
  if (formIsNotValid) {
    e.preventDefault();
  }
};

var onFormElemBorderReset = function (e) {
  e.target.style.border = 'none';
};

var onFormButtonSubmit = function () {
  mainForm.reset();
  setDependenceForCapacityAndRoomsField();
};

var setValidationOnMainForm = function () {
  setDependenceForCapacityAndRoomsField();
  setAttrOnElem(mainForm, mainFormAttr);
  setAttrOnElem(addressField, addressFieldAtrr);
  setAttrOnElem(titleField, titleFieldAtrr);
  setAttrOnElem(priceField, priceFieldAtrr);
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].addEventListener('change', onFormElemBorderReset);
  }
  typeField.addEventListener('change', onTypeFieldChange);
  timeOutField.addEventListener('change', onTimeFieldChange(timeInField));
  timeInField.addEventListener('change', onTimeFieldChange(timeOutField));
  roomsField.addEventListener('change', setDependenceForCapacityAndRoomsField);
  submitBtn.addEventListener('click', validationCheck);
  submitBtn.addEventListener('submit', onFormButtonSubmit);
};

setValidationOnMainForm();
