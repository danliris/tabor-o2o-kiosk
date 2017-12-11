angular.module('app')
    .controller('OrderCheckoutController', OrderCheckoutController);

OrderCheckoutController.$inject = ['$state', '$window', 'toastr', 'Order', 'AuthenticationState'];
function OrderCheckoutController($state, $window, toastr, Order, AuthenticationState) {
    var vm = this;

    vm.order = {};
    vm.shippingAddress = {};

    vm.removeOrderItem = removeOrderItem;
    vm.updateAddress = updateAddress;
    vm.toggleToKiosk = toggleToKiosk;
    vm.currentUser = AuthenticationState.getUser();

    (function () {
        vm.order = Order.getCurrentOrder();

        if (vm.order.items.length == 0) {
            toastr.warning('Keranjang belanja Anda kosong.');
            $state.go('app.home');
        }

        vm.order.toKiosk = (vm.order.toKiosk == undefined) ? true : vm.order.toKiosk;

        vm.shippingAddress = {
            name: vm.order.name,
            phone: vm.order.phone,
            email: vm.order.email,
            address: vm.order.address,
            idCard: vm.order.idCard,
            toKiosk: vm.order.toKiosk
        };

        toggleToKiosk(vm.order.toKiosk);

    })();

    function removeOrderItem(item) {
        if (confirm('Apakah anda yakin untuk membatalkan transaksi item ini?')) {
            Order.removeOrderItem(item);
            toastr.warning('Item telah dihapus dari transaksi ini', 'Pesan');
        }
    }

    function updateAddress(shippingAddress) {
        vm.order.name = shippingAddress.name;
        vm.order.phone = shippingAddress.phone;
        vm.order.email = shippingAddress.email;
        vm.order.address = shippingAddress.address;
        vm.order.idCard = shippingAddress.idCard;
        vm.order.toKiosk = shippingAddress.toKiosk;
        vm.order.kioskCode = vm.currentUser.kiosk.code;

        $state.go('app.confirm');

    }

    function toggleToKiosk(val) {
        if (val) {
            vm.shippingAddress.address = vm.currentUser.kiosk.address;
        }
        else {
            vm.shippingAddress.address = '';
        }
    }
}