(function () {
    'use strict';

    angular.module('myApp.controllers', [])
        .controller('TileViewController', ['$scope', '$interval', 'openData', 'tileFactory', function ($scope, $interval, openDataPromise, tileFactory) {

            var updateDisplay;

            $scope.data = {};
            $scope.data.secondsCounter = 0;
            $scope.flags = {orderBy: 'change'};


            updateDisplay = function () {
                $interval(function () {
                    angular.forEach($scope.data.tileObjects, function (tile) {
                        tile.update();
                    });

                    $scope.data.secondsCounter += 1;
                }, 1000);
            };

            openDataPromise.then(function (parsedData) {
                    $scope.data.tileObjects = tileFactory.makeTiles(parsedData);
                    updateDisplay();
                }
            );

        }]);
})();