(function () {
    'use strict';

    angular.module('echtzeit.filters', []).
        filter('interpolate', ['version', function (version) {
            return function (text) {
                return String(text).replace(/\%VERSION\%/mg, version);
            };
        }]).
        filter('dotToComma', [function () {
            return function (inputString) {
                return String(inputString).replace(/(\d)\.(\d)/g, '$1,$2');
            };
        }]).
        filter('toTextNumber', [function () {
            return function (number, format, digits) {
                if (format === 'd') {
                    return String(parseInt(number, 10));
                }

                if (format ==='f')
                    return  String(Number(number).toFixed(digits)).replace(/(\d)\.(\d)/g, '$1,$2');
            };
        }]);

})();