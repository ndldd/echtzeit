(function () {
    'use strict';

    angular.module('myApp.controllers', [])
        .controller('MyCtrl1', ['$scope', '$interval', '$timeout', '$q', '$sanitize', function ($scope, $interval, $timeout, $q, $sanitize) {

            $scope.data = {};
            $scope.data.timePast = 0;

            var updateTimePast = function () {
                $interval(function () {
                    $scope.data.timePast += 1;
                }, 1000);
            };


            $scope.flags = {orderBy: 'change'};

            $scope.setOrder = function (string) {
                $scope.flags.orderBy = string;
            };

            function getData() {
                var deferred = $q.defer();
                var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1UotFPraJTw6bgKWufi53Vv7KelNLgBSoX_js4P-Ou4M/pubhtml';


                function init() {
                    Tabletop.init({ key: public_spreadsheet_url,
                        callback: showInfo,
                        simpleSheet: true });
                }

                function showInfo(data, tabletop) {
                    deferred.resolve(data);

                }

                init();

                return deferred.promise;

            }

            var changePerSecond = function (changePerDay) {
                var secondsPerDay = 86400;
                return changePerDay / secondsPerDay;

            };


            var display = function (data) {

                $scope.data.tiles = data;


                var makeTiles = function (data) {
                    var tileObjects = [];

                    angular.forEach(data, function (item) {

                        var newValue = {};
                        angular.extend(newValue, item);

                        newValue.value = 0;
                        newValue.displayValue = 0;
                        newValue.title = item.title.sprintf(newValue.displayValue);
                        var change = parseInt(item.change, 10);
                        newValue.changeRate = changePerSecond(change);


                        if (newValue.color === '#ffff33') { // yellow tiles
                            newValue.textColor = 'black';
                        }
                        else {
                            newValue.textColor = 'white';
                        }

                        newValue.update = function () {


                            this.displayValue = Math.floor(this.value);
                            this.title = item.title.sprintf(this.displayValue);
                            this.value += this.changeRate;


                        };

                        newValue.calculateChangeFormat = function () {
//                            this.displayChange = ' %d pro Stunde'.sprintf(this.change);
                            if (this.change < 100) {
                                this.displayChange = ' %.2f %s pro Tag'.sprintf(this.change, this.unit);
                            }
                            else if (this.change > 100 && this.change < 1000) {
                                this.displayChange = ' %.2f %s pro Stunde'.sprintf(this.change / 24, this.unit);
                            }
                            else if (this.change >= 1000 && this.change < 10000) {
                                this.displayChange = ' %.2f %s pro Minute'.sprintf(this.change / (24 * 60), this.unit);

                            }
                            else {
                                this.displayChange = ' %.2f %s pro Sekunde'.sprintf(this.change / (24 * 60 * 60), this.unit);
                            }


                        };
                        newValue.calculateChangeFormat();

                        tileObjects.push(newValue);

                    });
                    return tileObjects;
                };

                $scope.data.tileObjects = makeTiles($scope.data.tiles);

                $interval(function () {


                    angular.forEach($scope.data.tileObjects, function (tile) {
                        tile.update();
                    });

                }, 1000);
            };

            var promise = getData();
            promise.then(function (data) {
                    display(data);
                }
            );
            updateTimePast();


        }]);


})();