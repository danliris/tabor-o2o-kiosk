angular.module('app')
    .controller('OrderTrackController', OrderTrackController);

OrderTrackController.$inject = ['OrderService', '$uibModal'];
function OrderTrackController(OrderService, $uibModal) {
    var vm = this;
    vm.getOrder = getOrder;

    function getOrder(code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/order/detail.modal.html',
            controller: 'OrderDetailModalController',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                code: function () {
                    return code;
                }
            }
        });
    }
}