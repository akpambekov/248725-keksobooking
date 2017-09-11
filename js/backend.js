'use strict';

(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  var setup = function (loadFunc, errorFunc) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          loadFunc(xhr.response);
          break;
        default:
          errorFunc('Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorFunc('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      errorFunc('Истек период ожидания');
    });

    xhr.timeout = 10000;

    return xhr;
  };

  var saveDate = function (data, loadFunc, errorFunc) {
    var xhr = setup(loadFunc, errorFunc);

    xhr.open('POST', SERVER_URL);
    xhr.send(data);
  };

  var loadDate = function (loadFunc, errorFunc) {
    var xhr = setup(loadFunc, errorFunc);

    xhr.open('GET', SERVER_URL + '/data');
    xhr.send();
  };

  window.backend = {
    save: saveDate,
    load: loadDate
  };

})();

