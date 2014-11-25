(function () {
    'use strict';

    angular.module('myApp', [
        'ngRoute',
        'ngSanitize',
        'myApp.filters',
        'myApp.services',
        'myApp.directives',
        'myApp.controllers' ,

        'ngAnimate'
    ]).
        config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
            $routeProvider.otherwise({redirectTo: '/'});
        }]);


})();