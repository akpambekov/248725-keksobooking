'use strict';

(function () {
  var dialog = document.querySelector('#offer-dialog');
  var buildingType = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

  var hideDialogOnDefault = function () {
    dialog.classList.add('hidden');
  };

  window.createActivePinInfo = function (data) {
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
    var dialogPanel = document.querySelector('.dialog__panel');
    var fragmentForFeatures = document.createDocumentFragment();
    var fragmentForPhotos = document.createDocumentFragment();
    var activeUserDscr = activeUserInfo.querySelector('.lodge__description');
    var activeUserPhotos = activeUserInfo.querySelector('.lodge__photos');

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

    for (var imgCount = 0; imgCount < data.offer.photos.length; imgCount++) {
      var photo = document.createElement('img');
      photo.src = data.offer.photos[imgCount];
      photo.style.width = '52px';
      photo.style.height = '42px';
      fragmentForPhotos.appendChild(photo);
    }

    activeUserFeatures.appendChild(fragmentForFeatures);
    activeUserPhotos.appendChild(fragmentForPhotos);
    activeUserDscr.textContent = data.offer.description;
    activeUserAvatar.setAttribute('src', data.author.avatar);
    dialog.replaceChild(activeUserInfo, dialogPanel);
  };

  hideDialogOnDefault();
})();
