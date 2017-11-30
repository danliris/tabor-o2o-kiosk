angular.module('app')
    .directive('invoiceRefundment', invoiceRefundment);

function invoiceRefundment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        link: (scope, element, attrs, controllers) => {
        },
        templateUrl: 'app/invoice/_refundment.html'
    }
}