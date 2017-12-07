angular.module('app')
    .controller('OrderPaymentController', OrderPaymentController);

OrderPaymentController.$inject = ['$rootScope', '$filter', '$stateParams', '$state', '$window', 'toastr', 'Order', 'OrderService', '$uibModal'];
function OrderPaymentController($rootScope, $filter, $stateParams, $state, $window, toastr, Order, OrderService, $uibModal) {
    var vm = this;

    vm.order = {};
    vm.orderPayment = {};
    vm.pay = pay;
    vm.changePaymentType = changePaymentType;
    vm.goToPrint = goToPrint;
    vm.confirmPayment = confirmPayment;
    // vm.changePaidAmount = changePaidAmount;

    // function changePaidAmount() {
    //     var total = vm.order.TotalPrice + vm.order.TotalShippingFee;
    //     if (vm.orderPayment.PaidAmount >= total) {
    //         vm.orderPayment.PaymentType = 'FULL PAYMENT';
    //         changePaymentType('FULL PAYMENT');
    //     }
    // }

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                if (res.IsFullyPaid) {
                    toastr.error('Pesanan sudah dibayar.');
                    $state.go('app.order.draft');
                }

                if (res.Status == 'REQUESTED') {
                    $state.go('app.order.draft');
                }

                vm.order = res;

                vm.orderPayment = {
                    OrderCode: code,
                    PaidAmount: 0,
                    Amount: vm.order.TotalPrice + vm.order.TotalShippingFee - vm.order.DP,
                    PaymentType: 'FULL PAYMENT'
                };

                changePaymentType('FULL PAYMENT');
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function pay(orderPayment) {
        vm.loadingPay = true;
        OrderService.pay(orderPayment)
            .then(res => {
                return OrderService.getByCode(orderPayment.OrderCode)
                // vm.orderToBePrinted = res.result;
                // vm.message = 'Pesanan Anda telah berhasil dilakukan!';
            })
            .then(res => {
                vm.orderToBePrinted = res;
                vm.message = 'Pesanan Anda telah berhasil dilakukan!';
            })
            .catch(function (res) {
                toastr.error(res);
            })
            .finally(function () {
                vm.loadingPay = false;
            });
    }

    function confirmPayment(orderPayment) {
        if (orderPayment.Amount > orderPayment.PaidAmount) {
            toastr.error('Insufficient funds!');
            return;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'paymentConfirmation.html',
            controller: 'PaymentConfirmationController',
            controllerAs: 'vm',
            size: 'md',
            resolve: {
                order: function () { return vm.order; },
                orderPayment: function () { return orderPayment; }
            }
        });

        modalInstance.result
            .then(res => {
                return pay(orderPayment);
            });
    }


    function changePaymentType(val) {
        vm.orderPayment.Amount = vm.order.TotalShippingFee;
        if (val == 'FULL PAYMENT') {
            vm.orderPayment.Amount += vm.order.TotalPrice;
            vm.orderPayment.PaidAmount = vm.orderPayment.Amount;
        }
        else if (val == 'DOWN PAYMENT') {
            vm.orderPayment.Amount += vm.order.DP;
            vm.orderPayment.PaidAmount = 0;
        }
    }

    function goToPrint() {
        var paymentId = $filter('orderBy')(vm.orderToBePrinted.OrderPayments, '-TransactionDate')[0].id;

        var url = $state.href('blank.invoice', { code: vm.orderToBePrinted.Code, paymentId: paymentId });
        $window.open(url, '_blank');
    }

    (function () {
        var code = $stateParams.code;

        getOrderByCode(code);
    })();

}

angular.module('app')
    .controller('PaymentConfirmationController', PaymentConfirmationController);

PaymentConfirmationController.$inject = ['AuthenticationState', '$uibModalInstance', 'order', 'orderPayment', 'WalletService', '$rootScope'];
function PaymentConfirmationController(AuthenticationState, $uibModalInstance, order, orderPayment, WalletService, $rootScope) {
    var vm = this;
    vm.orderPayment = orderPayment;

    vm.ok = ok;
    vm.cancel = cancel;
    vm.getWalletBalance = getWalletBalance;

    (function () {
        getWalletBalance();

        if (order.TotalPrice + order.TotalShippingFee <= orderPayment.PaidAmount) {
            vm.orderPayment.PaymentType = 'FULL PAYMENT';
            vm.orderPayment.Amount = vm.orderPayment.PaidAmount = order.TotalPrice + order.TotalShippingFee;
        }
    })();

    function ok() {
        $uibModalInstance.close();
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function getWalletBalance() {
        vm.loadingGetWalletBalance = true;
        return WalletService.getWalletBalance(AuthenticationState.getUser().email)
            .then(res => {
                var result = res.result;
                $rootScope.$settings.walletBalance = (result.topupCredit + result.rewardCredit) || 0;
            })
            .catch(err => {

            })
            .finally(() => {
                vm.loadingGetWalletBalance = false;
            });
    }
}