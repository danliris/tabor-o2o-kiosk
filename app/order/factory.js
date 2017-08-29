angular.module('app')
    .factory('Order', Order);

Order.$inject = [
    '$sessionStorage'
];

function Order($sessionStorage) {
    return {
        getTotalItems: getTotalItems,
        getCurrentOrder: getCurrentOrder,
        addOrderItem: addOrderItem,
        removeOrderItem: removeOrderItem
    }

    function getTotalItems() {
        initiateOrder();

        return $sessionStorage.order.items.length;
    }

    function getCurrentOrder() {
        initiateOrder();

        return $sessionStorage.order;
    }

    function addOrderItem(item) {
        initiateOrder();

        var existingDataIndex = $sessionStorage.order.items.indexOf(item);

        if (existingDataIndex > -1) {
            $sessionStorage.order.items[existingDataIndex].Quantity++;
        }
        else {
            item.Quantity = 1;
            $sessionStorage.order.items.push(item);
        }
    }

    function removeOrderItem(item) {
        var index = $sessionStorage.order.items.indexOf(item);
        $sessionStorage.order.items.splice(index, 1);
    }

    function initiateOrder() {
        if (!$sessionStorage.order) {
            $sessionStorage.order = {};
            $sessionStorage.order.items = [];
        }
    }
}