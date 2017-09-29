angular.module('app')
    .directive('invoiceFulfillment', invoiceFulfillment);

function invoiceFulfillment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/fulfillment.html'
    }
}