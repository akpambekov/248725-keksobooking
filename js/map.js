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

var mainForm = document.querySelector('.notice__form');
var formElements = mainForm.querySelectorAll('input, select');
var priceField = mainForm.elements.price;
var typeField = mainForm.elements.type;
var timeInField = mainForm.elements.timein;
var timeOutField = mainForm.elements.timeout;
var roomsField = mainForm.elements.rooms;
var capacityField = mainForm.elements.capacity;
var submitBtn = mainForm.querySelector('.form__submit');

var typesAndPricesRatio = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var roomsAndGuestsRatio = {
  '1': [1],
  '2': [2, 1],
  '3': [3, 2, 1],
  '100': [0]
};

var onTypeFieldChange = function () {
  priceField.style.border = 'none';
  priceField.setAttribute('min', typesAndPricesRatio[typeField.value]);
};

var syncValues = function (field1, field2) {
  field1.addEventListener('change', function () {
    field2.value = field1.value;
  });
};

var enableSelect = function (elem) {
  elem.disabled = false;
};

var disableSelect = function (elem) {
  elem.disabled = true;
};

var isElemOnArray = function (arr, elem) {
  return arr.indexOf(elem) !== -1;
};

var getRoomsFieldSelectedValue = function () {
  var rooms = roomsField.options;
  var selectedValue = null;
  for (var i = 0; i < rooms.length; i++) {
    if (rooms[i].selected) {
      selectedValue = rooms[i].value;
    }
  }
  return selectedValue;
};

/* Я не очень понял, как можно избавиться от объекта с соотношением гостей - комнат и заменить все это функцией,
 была идея с конструкцией switch и строгой привязкой к атрибуту name у опции, но мне кажется это плохая идея.
 На этот счет можно бы устроить консультацию.
 По функции, постарался ее сократить и сделать более читаемой
 */
var setDependenceForFields = function (arr, obj, key) {
  for (var j = 0; j < arr.length; j++) {
    var elemValue = parseInt(arr[j].value, 10);
    var guests = obj[key];
    if (isElemOnArray(guests, elemValue)) {
      enableSelect(arr[j]);
    } else {
      disableSelect(arr[j]);
    }
    if (elemValue === guests[0]) {
      arr[j].selected = true;
    }
  }
};

var onRoomsFieldChange = function () {
  setDependenceForFields(capacityField.options, roomsAndGuestsRatio, getRoomsFieldSelectedValue());
};

var validationCheck = function (e) {
  var formIsValid = true;
  for (var i = 0; i < formElements.length; i++) {
    if (formElements[i].checkValidity() === false) {
      formElements[i].style.border = '2px solid red';
      formIsValid = false;
    }
  }
  if (!formIsValid) {
    e.preventDefault();
  }
};

var onFormElemBorderReset = function (e) {
  e.target.style.border = 'none';
};

var onFormButtonSubmit = function () {
  mainForm.reset();
  setDependenceForFields(capacityField.options, roomsAndGuestsRatio, getRoomsFieldSelectedValue());
};

var setValidationOnMainForm = function () {
  typeField.value = 'bungalo';
  setDependenceForFields(capacityField.options, roomsAndGuestsRatio, getRoomsFieldSelectedValue());
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].addEventListener('focus', onFormElemBorderReset);
  }
  syncValues(timeInField, timeOutField);
  syncValues(timeOutField, timeInField);
  typeField.addEventListener('change', onTypeFieldChange);
  roomsField.addEventListener('change', onRoomsFieldChange);
  submitBtn.addEventListener('click', validationCheck);
  submitBtn.addEventListener('submit', onFormButtonSubmit);
};

setValidationOnMainForm();
