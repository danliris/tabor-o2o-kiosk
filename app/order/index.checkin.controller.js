angular.module('app')
    .controller('OrderCheckInController', OrderCheckInController);

OrderCheckInController.$inject = ['OrderService', 'toastr', '$uibModal'];
function OrderCheckInController(OrderService, toastr, $uibModal) {
    var vm = this;
    vm.getOrder = getOrder;
    vm.arriveOrder = arriveOrder;

    function getOrder(code) {
        vm.loadingGetOrder = true;
        OrderService.getByCode(code)
            .then(function (order) {
                //// statusnya mesti delivered ke courier
                if (order.Status != 'DELIVERED') {
                    toastr.error(`Invalid status: ${order.Status}`);
                    return;
                }
                vm.order = order;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingGetOrder = false;
            });
    }

    function arriveOrder(order) {
        vm.loadingArriveOrder = true;
        OrderService.arrive(order.Code)
            .then(res => {
                toastr.success('Order has been set to arrived');
                delete vm.order;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingArriveOrder = false;
            });
    }
}