'use strict';

(function () {
  window.usersData = [];
  window.USERS_NUMBER = 8;

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

  var createUsersData = function () {
    for (var i = 0; i < window.USERS_NUMBER; i++) {
      window.usersData.push(getUserData(i + 1));
    }
  };

  createUsersData();
})();
