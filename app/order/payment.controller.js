angular.module('app')
    .controller('OrderPaymentController', OrderPaymentController);

OrderPaymentController.$inject = ['$rootScope', '$filter', '$stateParams', '$state', '$timeout', '$window', 'toastr', 'Order', 'OrderService'];
function OrderPaymentController($rootScope, $filter, $stateParams, $state, $timeout, $window, toastr, Order, OrderService) {
    var vm = this;

    vm.order = {};
    vm.orderPayment = {};
    vm.pay = pay;
    vm.changePaymentType = changePaymentType;
    vm.goToPrint = goToPrint;

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                if (res.IsFullyPaid) {
                    toastr.error('Order has already been paid.', 'Message');
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
        if (orderPayment.Amount > orderPayment.PaidAmount) {
            toastr.error('Insufficient funds!');
            return;
        }

        vm.loadingPay = true;
        OrderService.pay(orderPayment)
            .then(function (res) {
                //updatePaymentStatus(res.result.Code);
                vm.orderToBePrinted = res.result;
                vm.message = 'Your order has been submitted successfully!';
            })
            .catch(function (res) {
                toastr.error(res);
            })
            .finally(function () {
                vm.loadingPay = false;
            });
    }

    //function updatePaymentStatus(code) {
    //    vm.loadingUpdatePaymentStatus = true;   
    //    OrderService.updatePaymentStatus(code)
    //        .then(function (res) {
    //            vm.orderToBePrinted = res.result;
    //            vm.message = 'Your order has been submitted successfully!';
    //        })
    //        .catch(function (res) {
    //            toastr.error(res);
    //        })
    //        .finally(function () {
    //            vm.loadingUpdatePaymentStatus = false;
    //        });
    //}


    function changePaymentType(val) {
        vm.orderPayment.Amount = vm.order.TotalShippingFee;
        if (val == 'FULL PAYMENT') {
            vm.orderPayment.Amount += vm.order.TotalPrice;
        }
        else if (val == 'DOWN PAYMENT') {
            vm.orderPayment.Amount += vm.order.DP;
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