angular.module('app')
    .directive('invoiceFullPayment', invoiceFullPayment);

function invoiceFullPayment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/full-payment.html'
    }
}