(function () {

    'use strict';

    angular.module('echtzeit.controllers', [])
        .controller('TileViewController', ['$scope', '$interval', 'openData', 'tileFactory', '$timeout', function ($scope, $interval, openDataPromise, tileFactory, $timeout) {
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

                    // delay listening for mouseenter/mouseout events until the fade-in animation is finished
                    $timeout(function () {
                        $scope.flags.ready = true;
                    }, 500);
                }
            );


        }]);

})();

