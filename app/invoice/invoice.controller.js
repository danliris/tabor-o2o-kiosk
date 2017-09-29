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
                var orderPayments = $filter('filter')(res.OrderPayments, { id: $stateParams.paymentId });
                if (orderPayments.length == 0) {
                    $window.close();
                }

                vm.orderPayment = orderPayments[0];

                //vm.order.fullPayment = vm.orderPayment.Amount == vm.order.TotalPrice

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