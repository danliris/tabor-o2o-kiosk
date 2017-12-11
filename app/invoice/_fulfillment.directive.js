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
        link: (scope, element, attrs, controllers) => {

        },
        templateUrl: 'app/invoice/_fulfillment.html'
    }
}