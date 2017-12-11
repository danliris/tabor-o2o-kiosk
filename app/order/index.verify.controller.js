﻿angular.module('app')
    .controller('OrderVerifyController', OrderVerifyController);

OrderVerifyController.$inject = ['OrderService', 'toastr', '$filter', '$timeout', '$state', '$window'];
function OrderVerifyController(OrderService, toastr, $filter, $timeout, $state, $window) {
    var vm = this;

    //vm.confirmPayment = confirmPayment;
    vm.searchOrderByCodeAndPin = searchOrderByCodeAndPin;
    vm.pay = pay;
    vm.completeOrder = completeOrder;
    vm.goToPrint = goToPrint;

    function searchOrderByCodeAndPin(code, pin) {
        vm.loadingGetOrder = true;

        OrderService.getByCodePIN(code, pin)
            .then(function (response) {
                if (response.length == 0) {
                    toastr.error('Anda memasukkan Kode/PIN yang salah.', 'Pesan');
                    return;
                }

                var order = response[0];

                vm.order = order;

                var currentPaidAmount = $filter('sum')(vm.order.OrderPayments, 'PaidAmount');

                vm.orderPayment = {
                    PaymentType: 'FULFILLMENT',
                    OrderCode: order.Code,
                    PaidAmount: order.TotalPrice + order.TotalShippingFee - currentPaidAmount,
                    Amount: order.TotalPrice + order.TotalShippingFee - currentPaidAmount
                };
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrder = false;
            });
    }

    function pay(orderPayment) {
        if (orderPayment.Amount > orderPayment.PaidAmount) {
            toastr.error('Insufficient funds');
            return;
        }

        vm.loadingPay = true;

        OrderService.pay(orderPayment)
            .then(function (res) {
                //return OrderService.updatePaymentStatus(res.result.Code);
                // vm.order = res.result;

                return searchOrderByCodeAndPin(vm.code, vm.pin);
            })
            //.then(function (res) {
            //    vm.order = res.result;
            //})
            .catch(function (err, error) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingPay = false;
            });
    }

    //function confirmPayment(order) {
    //    vm.loadingConfirmPayment = true;

    //    var data = {
    //        orderCode: vm.order.Code,
    //        amount: vm.order.TotalPrice - $filter('sum')(vm.order.OrderPayments, 'Amount')
    //    };

    //    OrderService.complete(data)
    //        .then(function (response) {
    //            toastr.success('Your order has been verified successfully');
    //        })
    //        .catch(function (response) {
    //            var error = response.data.error;

    //            toastr.warning(error.message, error.status + ' - ' + error.code + ' - ' + error.name);
    //        })
    //        .finally(function () {
    //            vm.loadingConfirmPayment = false;
    //        });

    //}

    function completeOrder(order) {
        vm.loadingCompleteOrder = true;
        OrderService.complete(order.Code)
            .then(function (res) {
                toastr.success('Pesanan telah diterima oleh customer.');
                return searchOrderByCodeAndPin(vm.code, vm.pin);
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingCompleteOrder = false;
            });
    }

    function goToPrint() {
        var paymentId = $filter('orderBy')(vm.order.OrderPayments, '-TransactionDate')[0].id;

        var url = $state.href('blank.invoice', { code: vm.order.Code, paymentId: paymentId });
        $window.open(url, '_blank');
    }


}