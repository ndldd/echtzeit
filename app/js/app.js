(function () {
    'use strict';

    angular.module('echtzeit', [
        'ngRoute',
        'ngSanitize',
        'echtzeit.filters',
        'echtzeit.services',
        'echtzeit.directives',
        'echtzeit.controllers',
        'ngAnimate'
    ])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/', {templateUrl: 'partials/tileView.html', controller: 'TileViewController'});
            $routeProvider.otherwise({redirectTo: '/'});
        }]);
})();

