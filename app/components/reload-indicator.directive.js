angular.module('app')
    .directive('reloadIndicator', reloadIndicator);

function reloadIndicator() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            action: '&'
        },
        templateUrl: 'app/components/reload-indicator.html'
    };
}
