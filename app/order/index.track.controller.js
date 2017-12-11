angular.module('app')
    .controller('OrderTrackController', OrderTrackController);

OrderTrackController.$inject = ['OrderService', '$state', '$stateParams'];
function OrderTrackController(OrderService, $state, $stateParams) {
    var vm = this;
    vm.code = '';
    vm.submitOrder = submitOrder;

    function submitOrder(code) {
        $state.go('app.order.track', { code: code });
    }

    (function () {
        vm.code = $stateParams.code;

        if (vm.code) {
            getOrder(vm.code);
        }
    })();

    function getOrder(code) {
        vm.loadingGetOrder = true;
        vm.message = '';
        OrderService.getByCode(code)
            .then(function (order) {
                vm.order = order;
            })
            .catch(err => {
                vm.message = err;
            })
            .finally(() => {
                vm.loadingGetOrder = false;
            });
    }
}