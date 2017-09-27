angular.module('app')
    .directive('noData', noData);

function noData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/components/no-data.html'
    };
}
