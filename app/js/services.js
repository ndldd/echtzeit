(function () {
    'use strict';

    // use global Tabletop script to fetch data from spreadsheet
    angular.module('echtzeit.services', ['echtzeit.filters']).
        value('version', '0.1')


        // parses a Spreadsheet and returns the data
        .service('openData', ['$q', function ($q) {

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

        .factory('tileFactory', ['dotToCommaFilter', 'toTextNumberFilter', function (dotToComma, toTextNumber) {

            var changePerSecond = function (changePerDay) {
                var secondsPerDay = 86400;
                return changePerDay / secondsPerDay;
            };

            var service = {};

            // the tile Prototype
            var tile = {
                calculateChangeFormat: function () {
                    if (this.change < 100) {
                        this.displayChange = toTextNumber(this.change, 'f', 2) +' '+ this.unit +' pro Tag.';
                    }
                    else if (this.change >= 100 && this.change < 1000) {
                        this.displayChange = toTextNumber(this.change/24, 'f', 2) +' '+ this.unit +' pro Stunde.';

                    }
                    else if (this.change >= 1000 && this.change < 10000) {
                        this.displayChange = toTextNumber(this.change / (24 * 60), 'f', 2) +' '+ this.unit +' pro Minute.';
                    }
                    else {
                        this.displayChange = toTextNumber(this.change / (24 * 60 * 60), 'f', 2) +' '+ this.unit +' pro Sekunde.';
                    }
                },

                update: function () {

                    this.titleText = this.title.replace(/\%/, toTextNumber(this.value, this.numberformat, this.digits));
                    this.value += this.changeRate;
                }
            };

            // factory method for tiles
            service.makeTiles = function (data) {

                var tileObjects = [];
                var brightTileColors = ['#ffff33'];

                angular.forEach(data, function (item) {
                    var newTile;
                    var changePerDay;

                    newTile = Object.create(tile);
                    angular.extend(newTile, item);
                    newTile.value = 0;

                    changePerDay = parseInt(item.change, 10);
                    newTile.changeRate = changePerSecond(changePerDay);

                    newTile.titleText = item.title.replace(/\%/, toTextNumber(item.value, item.numberformat, item.digits));

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