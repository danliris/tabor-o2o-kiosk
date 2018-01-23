angular.module('app')
    .controller('OrderVerifyController', OrderVerifyController);

OrderVerifyController.$inject = ['OrderService', 'toastr', '$filter', '$timeout', '$state', '$window'];
function OrderVerifyController(OrderService, toastr, $filter, $timeout, $state, $window) {
    var vm = this;

    //vm.confirmPayment = confirmPayment;
    vm.searchOrderByCodeAndPin = searchOrderByCodeAndPin;
    vm.pay = pay;
    vm.completeOrder = completeOrder;
    vm.goToPrint = goToPrint;

    function weightRounding(weight) {
        if (weight == 0)
            weight = 0;
        else if (weight < 1)
            weight = 1;
        else if (weight - Math.floor(weight) > 0.3)
            weight = Math.ceil(weight);
        else
            weight = Math.floor(weight);

        return weight;
    }

    function searchOrderByCodeAndPin(code, pin) {
        vm.loadingGetOrder = true;

        delete vm.order;
        delete vm.orderPayment;

        OrderService.getByCodePIN(code, pin)
            .then(function (response) {
                if (response.length == 0) {
                    toastr.error('Anda memasukkan Kode/PIN yang salah.', 'Pesan');
                    return;
                }

                var order = response[0];

                if (order.Status != 'ARRIVED'
                    && order.Status != 'COMPLETED'
                    && order.Status != 'REJECTED'
                    && order.Status != 'REFUNDED'
                ) {
                    toastr.warning('Pesanan anda sedang diproses.', 'Pesan');
                    return;
                }

                vm.order = order;

                let rejectedAmount = vm.order.OrderDetails
                    .reduce((a, b) => {
                        return a + (b.Status == 'REJECTED' || b.Status == 'REFUNDED' ? b.Price : 0);
                    }, 0);

                vm.order.DPAmount = 0;
                var dpPayment = vm.order.OrderPayments.find(t => t.PaymentType == 'DOWN PAYMENT');
                if (dpPayment)
                    vm.order.DPAmount = dpPayment.PaidAmount;

                let paidAmount = vm.order.OrderPayments
                    .reduce((a, b) => {
                        return a + b.PaidAmount;
                    }, 0);

                //region Itung biaya kirim yang seharusnya
                // let reducedShippingFee = vm.order.TotalShippingFee;
                let reducedShippingFee = 0;

                if (vm.order.TotalShippingFee > 0) {
                    let usedShippingFee = 0;

                    let dealerCodes = Array.from(new Set(vm.order.OrderDetails.map(t => t.DealerCode)));

                    dealerCodes.forEach(dealerCode => {
                        // totalweight
                        let dealerTotalWeight = vm.order.OrderDetails
                            .reduce((a, b) => {
                                return a + b.Weight;
                            }, 0);

                        let dealerTotalShippingFee = weightRounding(dealerTotalWeight) * vm.order.OrderDetails[0].ShippingFee;

                        // totalusedweight
                        let dealerUsedTotalWeight = vm.order.OrderDetails
                            .filter(t => t.Status != 'REJECTED' && t.Status != 'REFUNDED')
                            .reduce((a, b) => {
                                return a + b.Weight;
                            }, 0);

                        let dealerUsedTotalShippingFee = weightRounding(dealerUsedTotalWeight) * vm.order.OrderDetails[0].ShippingFee;

                        reducedShippingFee += dealerTotalShippingFee - dealerUsedTotalShippingFee;
                    });
                }
                //endregion

                let paymentAmountLeft = vm.order.TotalPrice + vm.order.TotalShippingFee - rejectedAmount - paidAmount - reducedShippingFee;


                if (paymentAmountLeft != 0) {
                    vm.orderPayment = {
                        PaymentType: paymentAmountLeft > 0 ? 'FULFILLMENT' : 'REFUNDMENT',
                        OrderCode: code,
                        PaidAmount: paymentAmountLeft,
                        Amount: paymentAmountLeft
                    };
                }
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrder = false;
            });
    }

    function pay(orderPayment) {
        // if (orderPayment.Amount > orderPayment.PaidAmount) {
        //     toastr.error('Insufficient funds');
        //     return;
        // }

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
                toastr.success('Transaksi telah selesai dilakukan.');
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