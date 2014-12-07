(function () {
    'use strict';

    angular.module('myApp.directives', [])

        .directive('appVersion', ['version', function (version) {
            return function (scope, element) {
                element.text(version);
            };
        }])

        .directive('ezTileContainer', [function () {
            return {
                scope: {},
                controller: function () {
                    this._openTiles = [];

                    this.closeOthers = function(){
                        for (var i = 0; i< this._openTiles.length; i++){
                            this._openTiles[i].close();
                        }
                        this._openTiles = [];

                    };

                    this.registerAsOpen = function (tile) {
                        this._openTiles.push(tile);
                    };
                }

            };

        }])

        .directive('ezTile', [function () {

            return {
                require: '^ezTileContainer',
                scope: {
                    data: "="

                },
                link: function (scope, currentTile, attrs, ezTileContainerController) {


                    currentTile.close = function () {
                        currentTile.removeClass('zoomIn');
                        scope.showDetails = false;

                    };
                    var activate = function () {
                        ezTileContainerController.closeOthers();
                        ezTileContainerController.registerAsOpen(currentTile);

                        var top, left;
                        var detailDescription;

                        var tileCopy = currentTile.clone();

                        // calculate dimension of new tile
                        var oldWidth = currentTile[0].clientWidth;
                        var oldHeight = currentTile[0].clientHeight;
                        tileCopy[0].style.width = String(oldWidth + 20) + 'px';
                        tileCopy[0].style.position = 'absolute';


                        // calculate position for new tile

                        top = currentTile.parent()[0].offsetTop;


                        tileCopy[0].style.top = String(top - oldHeight * 0.2) + 'px';

                        left = currentTile.parent()[0].offsetLeft;
                        left = left - 25;
                        left = left >= 0 ? left : 0;

                        tileCopy[0].style.left = String(left) + 'px';


                        currentTile.off('mouseenter');


                        // insert the new tile on top of the old tile
                        currentTile.parent().parent().prepend(tileCopy);

                        // style the new tile
                        tileCopy.addClass('active');


                        // add details to the tile
                        detailDescription = angular.element("<div/>");
                        detailDescription.text('Veränderung: ' + scope.data.displayChange);

                        tileCopy.append(detailDescription);


                        tileCopy.bind('mouseleave click', function () {
                            tileCopy.remove();
                            currentTile[0].style.display = 'inline-block';
                            currentTile.bind('mouseenter', activate);
                        });
                    };

                    currentTile.bind('mouseenter', activate);
                    currentTile.bind('mouseout', function () {

                        currentTile.close();

                    });
                }
            };
        }]);
})();