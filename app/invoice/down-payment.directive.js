angular.module('app')
    .directive('invoiceDownPayment', invoiceDownPayment);

function invoiceDownPayment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/down-payment.html'
    }
}