(function () {
    'use strict';

// use global Tabletop script to fetch data from spreadsheet
    angular.module('myApp.services', []).
        value('version', '0.1')


        .service('openData', ['$q', function ($q) {
            // parses a Spreadsheet and returns the data

            var deferred = $q.defer();
            var fetchData;
            var resolvePromise;

            var publicGoogleSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1UotFPraJTw6bgKWufi53Vv7KelNLgBSoX_js4P-Ou4M/pubhtml';

            fetchData = function () {
                Tabletop.init({
                    key: publicGoogleSpreadsheetUrl,
                    callback: resolvePromise,
                    simpleSheet: true
                });
            };
            resolvePromise = function (data) {
                deferred.resolve(data);
            };

            fetchData();
            return deferred.promise;
        }])

        .factory('tileFactory', [function () {

            var changePerSecond = function (changePerDay) {
                var secondsPerDay = 86400;
                return changePerDay / secondsPerDay;
            };

            var service = {};

            // tile Prototype
            var tile = {
                calculateChangeFormat: function () {

                    if (this.change < 100) {
                        this.displayChange = ' %.2f %s pro Tag'.sprintf(this.change, this.unit);
                    }
                    else if (this.change >= 100 && this.change < 1000) {
                        this.displayChange = ' %.2f %s pro Stunde'.sprintf(this.change / 24, this.unit);
                    }
                    else if (this.change >= 1000 && this.change < 10000) {
                        this.displayChange = ' %.2f %s pro Minute'.sprintf(this.change / (24 * 60), this.unit);
                    }
                    else {
                        this.displayChange = ' %.2f %s pro Sekunde'.sprintf(this.change / (24 * 60 * 60), this.unit);
                    }
                },

                update: function () {
                    this.displayValue = Math.floor(this.value);
                    this.title = this.titleText.sprintf(this.displayValue);
                    this.value += this.changeRate;
                }
            };

            // factory method for tiles
            service.makeTiles = function (data) {

                var tileObjects = [];
                var brightTileColors = ['#ffff33'];

                angular.forEach(data, function (item) {

                    var change;
                    var newTile = Object.create(tile);

                    angular.extend(newTile, item);
                    newTile.value = 0;
                    newTile.displayValue = 0;
                    newTile.title = item.title.sprintf(newTile.displayValue);
                    newTile.titleText = item.title;

                    change = parseInt(item.change, 10);
                    newTile.changeRate = changePerSecond(change);

                    if (brightTileColors.indexOf(newTile.color) !== -1) {
                        newTile.textColor = 'black';     // better contrast
                    }
                    else {
                        newTile.textColor = 'white';
                    }
                    newTile.calculateChangeFormat();
                    tileObjects.push(newTile);
                });
                return tileObjects;
            };

            return service;
        }]);


})();