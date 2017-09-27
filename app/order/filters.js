angular.module('app').filter('totalPrice', totalPrice);
angular.module('app').filter('dpNominal', dpNominal);
angular.module('app').filter('totalDPNominal', totalDPNominal);

function totalPrice() {
    return function (items) {
        return items.reduce(function (a, b) {
            return a + (b.quantity * b.price);
        }, 0);
    }
}

function totalDPNominal() {
    return function (items) {
        return items.reduce(function (a, b) {
            return a + (b.quantity * (b.dp / 100 * b.price));
        }, 0);
    }
}

function dpNominal() {
    return function (item) {
        return item.quantity * (item.dp / 100 * item.price);
    }
}