'use strict';

(function () {
  var PRICE_FIELD_VALUES = [1000, 0, 5000, 10000];
  var mainForm = document.querySelector('.notice__form');
  var address = document.querySelector('#address');
  var formElements = mainForm.querySelectorAll('input, select');
  var priceField = mainForm.elements.price;
  var typeField = mainForm.elements.type;
  var timeInField = mainForm.elements.timein;
  var timeOutField = mainForm.elements.timeout;
  var roomsField = mainForm.elements.rooms;
  var capacityField = mainForm.elements.capacity;
  var submitBtn = mainForm.querySelector('.form__submit');
  var messageCloseBtn = document.querySelector('.message__close');

  var getValuesFromSelect = function (field) {
    var result = [];

    for (var i = 0; i < field.options.length; i++) {
      result.push(field.options[i].value);
    }

    return result;
  };

  var timeInFieldValues = getValuesFromSelect(timeInField);
  var timeOutFieldValues = getValuesFromSelect(timeOutField);
  var typeFieldValues = getValuesFromSelect(typeField);

  var roomsAndGuestsRatio = {
    '1': [1],
    '2': [2, 1],
    '3': [3, 2, 1],
    '100': [0]
  };

  window.setAddressValue = function (x, y) {
    address.value = x + ' , ' + y;
  };

  var setMinAttr = function (elem, value) {
    var errorMsg = priceField.nextElementSibling;

    if (errorMsg && errorMsg.classList.contains('error-message')) {
      errorMsg.remove();
    }

    elem.style.border = 'none';
    elem.setAttribute('min', value);
  };

  var syncValues = function (element, value) {
    element.value = value;
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

  var setDependenceForFields = function (arr, ratio, key) {
    for (var i = 0; i < arr.length; i++) {
      var elemValue = parseInt(arr[i].value, 10);
      var guests = ratio[key];

      /* не могу здесь использовать тернарный оператор,
      потому что ESLint начинает ругаться (требует присвоение выражения с тернарным оператором в переменную) */

      if (isElemOnArray(guests, elemValue)) {
        enableSelect(arr[i]);
      } else {
        disableSelect(arr[i]);
      }

      if (elemValue === guests[0]) {
        arr[i].selected = true;
      }
    }
  };

  var onRoomsFieldChange = function () {
    setDependenceForFields(capacityField.options, roomsAndGuestsRatio, roomsField.value);
  };

  var clearValidationErrorMessages = function () {
    var errorMessage = document.querySelectorAll('.error-message');

    for (var j = 0; j < errorMessage.length; j++) {
      errorMessage[j].remove();
    }
  };

  var validationCheck = function (e) {
    var formIsValid = true;
    clearValidationErrorMessages();

    for (var i = 0; i < formElements.length; i++) {
      if (formElements[i].checkValidity() === false) {
        formElements[i].style.border = '2px solid red';
        formIsValid = false;

        var inputCustomValidation = new window.CustomValidation();
        inputCustomValidation.clearInvalidities();
        inputCustomValidation.checkValid(formElements[i]);

        var customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
        formElements[i].insertAdjacentHTML('afterend', '<p class="error-message">' + customValidityMessageForHTML + '</p>');
      }
    }
    if (!formIsValid) {
      e.preventDefault();
    }
  };

  var onFormClearValidationErrorMsg = function (e) {
    e.target.style.border = 'none';
    var errorMsg = e.target.nextElementSibling;

    if (errorMsg && errorMsg.classList.contains('error-message')) {
      errorMsg.remove();
    }
  };

  var onFormButtonSubmit = function (e) {
    e.preventDefault();

    var onLoad = function () {
      window.showErrorMessage('Данные успешно отправлены');
      mainForm.reset();
      setDependenceForFields(capacityField.options, roomsAndGuestsRatio, roomsField.value);
      window.setAddressValue(window.mainPinPositionForAddressField.left, window.mainPinPositionForAddressField.top);

      window.mainPin.style.left = window.defaultMainPinPosition.left + 'px';
      window.mainPin.style.top = window.defaultMainPinPosition.top + 'px';
    };

    window.backend.save(new FormData(mainForm), onLoad, window.showErrorMessage);
  };

  var onMessageCloseButtonClick = function (e) {
    e.preventDefault();
    window.message.classList.add('hidden');
  };

  var setValidationOnMainForm = function () {
    typeField.value = 'bungalo';
    setDependenceForFields(capacityField.options, roomsAndGuestsRatio, roomsField.value);

    for (var i = 0; i < formElements.length; i++) {
      formElements[i].addEventListener('focus', onFormClearValidationErrorMsg);
    }

    window.synchronizeFields(timeOutField, timeInField, timeOutFieldValues, timeInFieldValues, syncValues);
    window.synchronizeFields(timeInField, timeOutField, timeInFieldValues, timeOutFieldValues, syncValues);
    window.synchronizeFields(typeField, priceField, typeFieldValues, PRICE_FIELD_VALUES, setMinAttr);
    roomsField.addEventListener('change', onRoomsFieldChange);
    submitBtn.addEventListener('click', validationCheck);
    mainForm.addEventListener('submit', onFormButtonSubmit);
    messageCloseBtn.addEventListener('click', onMessageCloseButtonClick);
  };

  setValidationOnMainForm();
})();
