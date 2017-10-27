angular.module('app').filter('totalPrice', totalPrice);
angular.module('app').filter('dpNominal', dpNominal);
angular.module('app').filter('totalDPNominal', totalDPNominal);
angular.module('app').filter('humanify', humanify);

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

function humanify() {
    return function (status) {
        if (status == 'DRAFTED')
            return 'Pesanan dibuat oleh pembeli';
        else if (status == 'REQUESTED')
            return 'Pesanan telah dikirim ke Dealer';
        else if (status == 'SUBMITTED')
            return 'Sudah diterima oleh Dealer';
        else if (status == 'REJECTED')
            return 'Dibatalkan oleh Dealer';
        else if (status == 'DELIVERED')
            return 'Pesanan sedang diantar.';
        else if (status == 'ARRIVED')
            return 'Pesanan sudah sampai di Outlet';
        else if (status == 'COMPLETED')
            return 'Pesanan sudah diterima oleh Customer';
        else if (status == 'VOIDED')
            return 'Pesanan dibatalkan oleh pembeli';
        else
            return status;
    }
}