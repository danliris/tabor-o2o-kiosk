angular.module('app')
    .factory('Order', Order);

Order.$inject = [
    '$sessionStorage',
    '$filter'
];

function Order($sessionStorage, $filter) {
    return {
        getCurrentOrder: getCurrentOrder,
        addOrderItem: addOrderItem,
        removeOrderItem: removeOrderItem,
        initiateOrder: initiateOrder
    }

    function getCurrentOrder() {
        if (!$sessionStorage.order) {
            initiateOrder();
        }

        return $sessionStorage.order;
    }

    function addOrderItem(item) {
        if (!$sessionStorage.order) {
            initiateOrder();
        }

        var existingData = $filter('filter')($sessionStorage.order.items, { 'sku': item.sku })[0];

        if (existingData) {
            existingData.quantity++;
        }
        else {
            item.quantity = 1;
            $sessionStorage.order.items.push(item);
        }
    }

    function removeOrderItem(item) {
        var index = $sessionStorage.order.items.indexOf(item);
        $sessionStorage.order.items.splice(index, 1);
    }

    function initiateOrder() {
        $sessionStorage.order = {};
        $sessionStorage.order.items = [];
    }
}