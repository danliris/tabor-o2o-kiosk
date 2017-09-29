angular.module('app')
    .controller('OrderCheckInController', OrderCheckInController);

OrderCheckInController.$inject = ['OrderService', 'toastr', '$uibModal'];
function OrderCheckInController(OrderService, toastr, $uibModal) {
    var vm = this;
    vm.getOrder = getOrder;
    vm.arriveOrder = arriveOrder;

    function getOrder(code) {
        OrderService.getByCode(code)
            .then(function (order) {
                // statusnya mesti delivered ke courier
                if (order.Status != 'DELIVERED') {
                    toastr.error(`Invalid status: ${order.Status}`);
                    return;
                }
                vm.order = order;
            });
    }

    function arriveOrder(order) {
        OrderService.arrive(order.Code)
            .then(function (res) {
                toastr.success('Order has been set to arrived');
            });
    }
}