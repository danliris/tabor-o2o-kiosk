angular.module('app')
    .directive('orderDetail', orderDetail);

function orderDetail() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '='
        },
        link: (scope, element, attrs, controllers) => {
            let dpPayment = scope.order.OrderPayments.find(t => t.PaymentType == 'DOWN PAYMENT');
            scope.order.DPAmount = dpPayment ? dpPayment.PaidAmount : 0;

            // let refundPayment = scope.order.OrderPayments.find(t => t.PaymentType == 'REFUNDMENT');
            // if (refundPayment) {
            //     scope.order.Refund = refundPayment.PaidAmount;
            // }
            // else {
            let rejectedAmount = scope.order.OrderDetails
                .reduce((a, b) => {
                    return a + (b.Status == 'REJECTED' || b.Status == 'REFUNDED' ? b.Price : 0);
                }, 0);
            //region Itung biaya kirim yang seharusnya
            // let reducedShippingFee = vm.order.TotalShippingFee;
            let reducedShippingFee = 0;

            if (scope.order.TotalShippingFee > 0) {
                let usedShippingFee = 0;

                let dealerCodes = Array.from(new Set(scope.order.OrderDetails.map(t => t.DealerCode)));

                dealerCodes.forEach(dealerCode => {
                    // totalweight
                    let dealerTotalWeight = scope.order.OrderDetails
                        .reduce((a, b) => {
                            return a + b.Weight;
                        }, 0);

                    let dealerTotalShippingFee = weightRounding(dealerTotalWeight) * scope.order.OrderDetails[0].ShippingFee;

                    // totalusedweight
                    let dealerUsedTotalWeight = scope.order.OrderDetails
                        .filter(t => t.Status != 'REJECTED' && t.Status != 'REFUNDED')
                        .reduce((a, b) => {
                            return a + b.Weight;
                        }, 0);

                    let dealerUsedTotalShippingFee = weightRounding(dealerUsedTotalWeight) * scope.order.OrderDetails[0].ShippingFee;

                    reducedShippingFee += dealerTotalShippingFee - dealerUsedTotalShippingFee;
                });
            }

            //endregion
            // }
            scope.order.Refund = rejectedAmount + reducedShippingFee;

            scope.order.GrandTotal = scope.order.TotalPrice + scope.order.TotalShippingFee - scope.order.Refund;

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
        },
        templateUrl: 'app/order/_detail.html'
    }
}