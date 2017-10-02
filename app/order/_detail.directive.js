angular.module('app')
    .directive('orderDetail', orderDetail);

function orderDetail() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '='
        },
        templateUrl: 'app/order/_detail.html'
    }
}