angular.module('app')
    .controller('OrderTrackController', OrderTrackController);

OrderTrackController.$inject = ['OrderService'];
function OrderTrackController(OrderService) {
    var vm = this;
    vm.getOrder = getOrder;

    function getOrder(code) {
        vm.loadingGetOrder = true;
        OrderService.getByCode(code)
            .then(function (order) {
                vm.order = order;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingGetOrder = false;
            });
    }
}