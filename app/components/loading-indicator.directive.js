angular.module('app')
    .directive('loadingIndicator', loadingIndicator);

function loadingIndicator() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/components/loading-indicator.html'
    };
}
