angular.module('app')
    .controller('OrderConfirmController', OrderConfirmController);

OrderConfirmController.$inject = ['$state', '$window', 'toastr', 'Order', 'OrderService', '$timeout', '$filter'];
function OrderConfirmController($state, $window, toastr, Order, OrderService, $timeout, $filter) {
    var vm = this;

    vm.order = {};
    vm.submitOrder = submitOrder;
    vm.cancelOrder = cancelOrder;

    function submitOrder(order) {
        if (confirm('Apakah anda yakin ingin melakukan pemesanan?')) {
            // submit order
            var convertedOrder = {
                KioskCode: order.kioskCode,
                IdCard: order.idCard,
                Name: order.name,
                Email: order.email,
                Latitude: 0,
                Longitude: 0,
                SelfPickUp: order.toKiosk,
                Address: order.address,
                Phone: order.phone,
                //DP: $filter('totalDPNominal')(order.items),
                //TotalQuantity: $filter('sum')(order.items, 'quantity'),
                //TotalShippingFee: 0,
                //TotalPrice: $filter('totalPrice')(order.items),
                //IsFullyPaid: false,
                OrderDetails: []
            };

            for (var i = 0, length = order.items.length; i < length; i++) {
                var item = order.items[i];

                convertedOrder.OrderDetails
                    .push({
                        ProductCode: item.code,
                        Quantity: item.quantity,
                        //Price: item.price,
                        //ShippingFee: 0,
                        //DPNominal: item.dp * item.price / 100,
                        DealerCode: item.dealerCode
                    });
            }

            vm.loadingCreateDraft = true;
            OrderService.createDraft(convertedOrder)
                .then(function (res) {
                    Order.initiateOrder();

                    //$timeout(function () {
                    window.location.href = 'confirm-message/' + res.result.Code;
                    //}, 1000);

                    //$state.go('confirm-message', { code: res.result.Code });
                })
                .catch(function (err) {
                    toastr.error(err);
                })
                .finally(function () {
                    vm.loadingCreateDraft = false;
                });
        }
    }

    function cancelOrder() {
        if (confirm('Apakah anda yakin ingin membatalkan pemesanan?')) {
            Order.initiateOrder();

            toastr.warning('Pesanan Anda telah berhasil dibatalkan.', 'Success');

            $timeout(function () {
                window.location.href = '';
            }, 2000);
        }
    }

    (function () {
        vm.order = Order.getCurrentOrder();

        if (vm.order.items.length == 0) {
            toastr.warning('Your cart is empty.');
            $state.go('app.home');
        }
    })();
};