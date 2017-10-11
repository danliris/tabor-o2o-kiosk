angular.module('app')
    .controller('OrderCheckInController', OrderCheckInController);

OrderCheckInController.$inject = ['OrderService', 'toastr'];
function OrderCheckInController(OrderService, toastr) {
    var vm = this;
    vm.getOrder = getOrder;
    // vm.arriveOrder = arriveOrder;
    vm.arriveOrderDetail = arriveOrderDetail

    function getOrder(code) {
        vm.loadingGetOrder = true;
        OrderService.getByCode(code)
            .then(order => {
                if (order.Status != 'DELIVERED' && order.Status != 'PARTIALLY DELIVERED') {
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

    // function arriveOrder(order) {
    //     vm.loadingArriveOrder = true;
    //     OrderService.arrive(order.Code)
    //         .then(res => {
    //             toastr.success('Pesanan telah berhasil diterima di outlet.');
    //             delete vm.order;
    //         })
    //         .catch(err => {
    //             toastr.error(err);
    //         })
    //         .finally(() => {
    //             vm.loadingArriveOrder = false;
    //         });
    // }

    function arriveOrderDetail(orderDetail) {
        orderDetail.loading = true;

        OrderService.detailArrive(orderDetail.OrderCode, orderDetail.Code)
            .then(response => {
                if (response.result)
                    return OrderService.getByCode(orderDetail.OrderCode);
            })
            .then(response => {
                vm.order = response;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                orderDetail.loading = false;
            });
    }
}