(function () {
    'use strict';

    angular.module('myApp.directives', [])

        .directive('appVersion', ['version', function (version) {
            return function (scope, elm, attrs) {
                elm.text(version);
            };
        }])

        .directive('ezTile', [function () {

            return {
                scope: {
                    data: "="
                },
                link: function (scope, currentTile) {

                    var activate = function () {
                        var top, left;
                        var detailDescription;
                        var tileCopy = currentTile.clone();


                        var oldWidth = currentTile[0].clientWidth;
                        var oldHeight = currentTile[0].clientHeight;


                        top = currentTile.parent()[0].offsetTop;
                        left = currentTile.parent()[0].offsetLeft;


                        tileCopy[0].style.width = String(oldWidth + 20) + 'px';
                        tileCopy[0].style.position = 'absolute';
                        tileCopy[0].style.fontSize = "30px";
                        tileCopy[0].style.borderRadius = '1px';


                        tileCopy.off('mouseenter');
                        currentTile.off('mouseenter');


                        // insert the new tile on top of the old tile
                        currentTile.parent().parent().prepend(tileCopy);


                        tileCopy[0].style.top = String(top - oldHeight * 0.2) + 'px';

                        left = left - 25;
                        left = left >= 0 ? left : 0;

                        tileCopy[0].style.left = String(left) + 'px';
                        tileCopy.addClass('shadow');


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
                        currentTile.removeClass('zoomIn');
                        scope.showDetails = false;
                    });
                }
            };
        }]);
})();