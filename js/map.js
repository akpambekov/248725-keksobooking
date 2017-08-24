'use strict';

// начальные данные


var usersNumber = 8;

var getUserID = function (numb) {
  var usersID = [];
  for (var i = 1; i <= numb; i++) {
    usersID.push('0' + i);
  }
  return usersID;
};

var usersID = getUserID(usersNumber);
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
  var result = Math.random() - 0.5;
  if (result > 0) {
    return 1;
  } else if (result < 0) {
    return -1;
  } else {
    return 0;
  }
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

var getArrayWithRandomLengthAndValues = function (arr) {
  var arrayLength = getRandomValueInRange(0, arr.length);
  var arrID = [];
  var randomKeysForArr = [];
  var result = [];
  if (arrayLength === arr.length) {
    return arr;
  }

  if (arrayLength === 0) {
    return [];
  }
  for (var i = 0; i < arr.length; i++) {
    arrID[i] = i;
  }

  arrID.sort(randomSort);
  for (i = 0; i < arrayLength; i++) {
    randomKeysForArr.push(arrID.pop());
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
var activeUserDscr = activeUserInfo.querySelector('.lodge__description');
var buildingType = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};

var setActivePinInfoOnPage = function (data) {
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

setActivePinInfoOnPage(usersData[0]);
