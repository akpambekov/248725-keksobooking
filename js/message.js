'use strict';

(function () {
  var setElemOnCenter = function (elem) {
    elem.style.marginLeft = -(elem.offsetWidth / 2) + 'px';
    elem.style.marginTop = -(elem.offsetHeight / 2) + 'px';
  };

  window.showErrorMessage = function (text) {
    window.message = document.querySelector('.message');
    var messageText = window.message.querySelector('.message__text');

    window.message.classList.remove('hidden');
    messageText.textContent = text;

    setElemOnCenter(window.message);
  };
}) ();
