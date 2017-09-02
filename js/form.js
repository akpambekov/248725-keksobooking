'use strict';

(function () {
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

  var setDependenceForFields = function (arr, ratio, key) {
    for (var i = 0; i < arr.length; i++) {
      var elemValue = parseInt(arr[i].value, 10);
      var guests = ratio[key];
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
})();
