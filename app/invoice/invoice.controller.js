angular.module('app')
    .controller('InvoiceController', InvoiceController);

InvoiceController.$inject = ['$stateParams', '$filter', '$timeout', '$window', 'OrderService', 'AuthenticationState'];
function InvoiceController($stateParams, $filter, $timeout, $window, OrderService, AuthenticationState) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.order = {};
    vm.orderPayment = {};
    vm.print = print;
    vm.close = close;

    (function () {
        getOrderByCode($stateParams.code);
    })();

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                vm.order = res;

                var dpPayment = vm.order.OrderPayments.find(t => t.PaymentType == 'DOWN PAYMENT');
                vm.order.DPAmount = dpPayment ? dpPayment.PaidAmount : 0;

                var orderPayments = $filter('filter')(res.OrderPayments, { id: $stateParams.paymentId });
                if (orderPayments.length == 0) {
                    $window.close();
                }

                vm.orderPayment = orderPayments[0];

                vm.order.RefundAmount = vm.order.TotalPrice + vm.order.TotalShippingFee - vm.order.DPAmount - vm.orderPayment.PaidAmount;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function print() {
        $window.print();
    }

    function close() {
        $window.close();
    }
}