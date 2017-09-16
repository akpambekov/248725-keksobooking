'use strict';

(function () {
  var getAttributeValue = function (input, attr) {
    return input.getAttribute(attr);
  };

  window.CustomValidation = function () {};

  window.CustomValidation.prototype = {
    invalidities: [],

    checkValid: function (input) {

      var validity = input.validity;

      if (validity.patternMismatch) {
        this.addInvalidity('Значение не удовлетворяет шаблону. Пример: 638 , 394');
      }

      if (validity.rangeOverflow) {
        var max = getAttributeValue(input, 'max');
        this.addInvalidity('Макс. значение - ' + max);
      }

      if (validity.rangeUnderflow) {
        var min = getAttributeValue(input, 'min');
        this.addInvalidity('Мин. значение - ' + min);
      }

      if (validity.valueMissing) {
        this.addInvalidity('Поле не заполнено');
      }

      if (validity.tooShort) {
        var minLength = getAttributeValue(input, 'minLength');
        this.addInvalidity('Мин. длина - ' + minLength + ' символов');
      }

      if (validity.tooLong) {
        var maxLength = getAttributeValue(input, 'maxLength');
        this.addInvalidity('Макс. длина - ' + maxLength + ' символов');
      }

    },

    addInvalidity: function (message) {
      this.invalidities.push(message);
    },

    clearInvalidities: function () {
      this.invalidities = [];
    },

    getInvaliditiesForHTML: function () {
      return this.invalidities.join('<br>');
    }
  };
})();
