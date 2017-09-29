angular.module('app')
    .controller('OrderDetailModalController', OrderDetailModalController);

OrderDetailModalController.$inject = ['code', 'OrderService', '$uibModalInstance', '$window', 'toastr'];
function OrderDetailModalController(code, OrderService, $uibModalInstance, $window, toastr) {
    var vm = this;
    vm.order = {};
    vm.close = close;
    vm.print = print;

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                vm.order = res;
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
        $uibModalInstance.dismiss('cancel');
    }

    (function () {
        getOrderByCode(code);
    })();
}