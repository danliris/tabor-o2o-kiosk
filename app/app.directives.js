angular
    .module('app')
    .directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attributes) {
                if (attributes.ngClick || attributes.href === '' || attributes.href === '#') {
                    element.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        }
    });
angular
    .module('app')
    .directive('backButton', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);

angular
    .module('app')
    .directive('ngSpinnerBar', ['$rootScope', '$transitions', function ($rootScope, $transitions) {
        return {
            link: function (scope, element, attributes) {
                // by default hide the spinner bar
                element.addClass('hide');

                $transitions.onStart({}, function () {
                    element.removeClass('hide');
                });

                $transitions.onSuccess({}, function () {
                    element.addClass('hide');
                });
            }
        }
    }]);