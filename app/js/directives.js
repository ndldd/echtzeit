(function () {
    'use strict';

    angular.module('echtzeit.directives', ['echtzeit.filters'])
        .directive('appVersion', ['version', function (version) {
            return function (scope, element) {
                element.text(version);
            };
        }])

        .directive('ezTile', ['dotToCommaFilter',function (dotToComma) {
            return {
                scope: {
                    data: "=",
                    ready: '='
                },
                link: function (scope, currentTile) {
                    var close = function () {
                        currentTile.removeClass('zoomIn');
                        scope.showDetails = false;
                    };

                    var activate = function () {
                        if (!scope.ready){
                            return;
                        }
                        var container;
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
                        left -= 25;
                        left = left >= 0 ? left : 0;
                        tileCopy[0].style.left = String(left) + 'px';

                        // insert the new tile on top of the original tile (to maintain the flow)
                        container = angular.element(document.getElementById('tile-container'));
                        container.prepend(tileCopy);
                        currentTile.off('mouseenter');

                        // style the new tile
                        tileCopy.addClass('active');

                        // add details to the new tile
                        detailDescription = angular.element("<div/>");
                        detailDescription.text('Veränderung: ' + dotToComma(scope.data.displayChange));
                        tileCopy.append(detailDescription);


                        tileCopy.bind('mouseleave click', function () {
                            tileCopy.remove();
                            currentTile[0].style.display = 'inline-block';
                            currentTile.bind('mouseenter', activate);
                        });
                    };

                    currentTile.bind('mouseenter', activate);

                    currentTile.bind('mouseout', function () {
                        close();
                    });
                }
            };
        }]);

})();