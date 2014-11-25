(function () {
    'use strict';

    angular.module('myApp.directives', []).
        directive('appVersion', ['version', function (version) {
            return function (scope, elm, attrs) {
                elm.text(version);
            };
        }]).directive('ezTile', [  function () {


            return {
                scope: { data: "="},

                link: function (scope, element, attrs) {


                    var activate = function () {
                        var div;


                        var newEl = element.clone();


                        var oldWidth = element[0].clientWidth;
                        var oldHeight = element[0].clientHeight;

                        newEl[0].style.width = oldWidth + 20 + 'px';

                        var top = element.parent()[0].offsetTop;
                        var left = element.parent()[0].offsetLeft;


                        newEl[0].style.position = 'absolute';
                        newEl[0].style.fontSize = "30px";
                        newEl[0].style.borderRadius = '1px';


                        newEl.off('mouseenter');
                        element.off('mouseenter');

                        element.parent().parent().prepend(newEl);


                        newEl[0].style.top = top - oldHeight * 0.2 + 'px';
                        left = left - 25;

                        left = left >= 0 ? left : 0;
                        newEl[0].style.left = left + 'px';
                        newEl.addClass('shadow');

                        div = angular.element('<div/>');
//                        div.text('Veränderung: ' + scope.data.changeRate);
                        div.text('Veränderung: ' + scope.data.displayChange);
                        console.log(div);
                        newEl.append(div);


                        newEl.bind('mouseleave click', function () {
                            newEl.remove();
                            element[0].style.display = 'inline-block';
                            element.bind('mouseenter', activate);
                        });

                    };


                    element.bind('mouseenter', activate);
                    element.bind('mouseout', function () {
                        element.removeClass('zoomIn');
                        scope.showDetails = false;






                    });

                }
            };
        }]);


})();
