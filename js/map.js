'use strict';

// начальные данные

var usersID = ['01', '02', '03', '04', '05', '06', '07', '08'];
var usersQuantity = usersID.length;
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

// вспомогательные функции

var randomSort = function () {
  return Math.random() - 0.5;
};

var getRandomValueInRange = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getUserAvatar = function (arr) {
  var currentUser = arr.shift();
  return 'img/avatars/user' + currentUser + '.png';
};

var getUserTitle = function (arr) {
  arr.sort(randomSort);
  return arr.pop();
};

var getRandomValueFromArray = function (arr) {
  var randomValue = getRandomValueInRange(0, arr.length - 1);
  return arr[randomValue];
};

var findMatches = function (array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return true;
    }
  }

  return false;
};

var getRandomKeyForArray = function (arr, length) {
  var randomKey = Math.round(Math.random() * (length - 1));

  if (findMatches(arr, randomKey) === true) {
    return getRandomKeyForArray(arr, length);
  }

  return randomKey;
};

var getArrayWithRandomLengthAndValues = function (arr) {
  var arrayLength = getRandomValueInRange(0, arr.length);

  if (arrayLength === 0) {
    return [];
  }

  var result = [];
  var randomKeysForArr = [];

  for (var i = 1; i <= arrayLength; i++) {
    randomKeysForArr.push(getRandomKeyForArray(randomKeysForArr, arrayLength));
  }

  randomKeysForArr.sort();

  for (i = 0; i < randomKeysForArr.length; i++) {
    result.push(arr[randomKeysForArr[i]]);
  }

  return result;
};

// основная функция для получения пользовательских данных

var getUserData = function () {
  var data = {
    'author': {
      'avatar': getUserAvatar(usersID)
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

var fragmentForPins = document.createDocumentFragment();
var pinMap = document.querySelector('.tokyo__pin-map');

/* По этому пункту есть вопрос. В задании сказано, что надо учитывать размеры элемента
   для того, что бы острый конец указателя был наравлен на задданные координаты, но если я их
   учитываю, то элементы начинают плавать по небу.
*/
var PIN_HEIGHT = 75;
var PIN_HALF_WIDTH = 56 / 2;

// получение данных и отрисовка координат на карте

for (var i = 0; i < usersQuantity; i++) {
  usersData.push(getUserData());

  var pin = document.createElement('div');
  pin.className = 'pin';
  pin.style.top = usersData[i].location.y - PIN_HEIGHT + 'px';
  pin.style.left = usersData[i].location.x - PIN_HALF_WIDTH + 'px';

  var pinImg = document.createElement('img');
  pinImg.className = 'rounded';
  pinImg.style.height = '40px';
  pinImg.style.width = '40px';
  pinImg.setAttribute('src', usersData[i].author.avatar);

  pin.appendChild(pinImg);
  fragmentForPins.appendChild(pin);
}

pinMap.appendChild(fragmentForPins);

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
var buildingType = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

activeUserTitle.textContent = usersData[0].offer.title;
activeUserAddress.textContent = usersData[0].offer.address;
activeUserPrice.textContent = usersData[0].offer.price + '\u20BD/ночь';
activeUserType.textContent = buildingType[usersData[0].offer.type];
activeUserGuests.textContent = 'Для ' + usersData[0].offer.guests + ' гостей в ' + usersData[0].offer.rooms + ' комнатах';
activeUserCheckin.textContent = 'Заезд после ' + usersData[0].offer.checkin + ', выезд до ' + usersData[0].offer.checkout;

for (var count = 0; count < usersData[0].offer.features.length; count++) {
  var feature = document.createElement('span');
  feature.className = 'feature__image feature__image--' + usersData[0].offer.features[count];
  fragmentForFeatures.appendChild(feature);
}

activeUserFeatures.appendChild(fragmentForFeatures);

var activeUserDscr = activeUserInfo.querySelector('.lodge__description');
activeUserDscr.textContent = usersData[0].offer.description;

activeUserAvatar.setAttribute('src', usersData[0].author.avatar);
parentElement.replaceChild(activeUserInfo, replacedElement);
