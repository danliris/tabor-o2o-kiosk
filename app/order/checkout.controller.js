angular.module('app')
    .controller('OrderCheckoutController', OrderCheckoutController);

OrderCheckoutController.$inject = ['Order'];
function OrderCheckoutController(Order) {
    var vm = this;

    vm.order = {};
    vm.removeOrderItem = removeOrderItem;

    (function () {
        vm.order = Order.getCurrentOrder();
    })();

    function removeOrderItem(item) {
        if (confirm('Are you sure want to delete this item?')) {
            Order.removeOrderItem(item);
        }
    }
}