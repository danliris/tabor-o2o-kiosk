angular.module('app')
    .controller('OrderDetailController', OrderDetailController);

OrderDetailController.$inject = ['$state', '$rootScope', '$filter', '$window', '$stateParams', 'AuthenticationState', 'OrderService', 'ShippingService', 'toastr'];
function OrderDetailController($state, $rootScope, $filter, $window, $stateParams, AuthenticationState, OrderService, ShippingService, toastr) {
    var vm = this;
    vm.order = {};
    vm.currentUser = AuthenticationState.getUser();

    vm.toggleSelfPickUp = toggleSelfPickUp;
    vm.updateDraft = updateDraft;
    vm.back = back;
    vm.voidDraft = voidDraft;
    vm.getLocations = getLocations;
    vm.selectPricingOption = selectPricingOption;
    vm.updateDetail = updateDetail;
    vm.removeCurrentShippingInformation = removeCurrentShippingInformation;

    function toggleSelfPickUp(val) {
        if (val) {
            vm.order.Address = 'Alamat default kiosk'; // generated from user login
            
            removeCurrentShippingInformation();

            delete vm.destination;
            delete vm.pricingOption;
        }
        else {
            vm.order.Address = '';
        }
    }

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                if (res.Status == 'REQUESTED') {
                    $state.go('app.order.draft');
                }

                vm.order = res;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function updateDraft(order) {
        vm.loadingUpdateDraft = true;

        var orderToBeUpdated = {
            Code: order.Code,
            KioskCode: order.KioskCode,
            IdCard: order.IdCard,
            Name: order.Name,
            Email: order.Email,
            Address: order.Address,
            SelfPickUp: order.SelfPickUp,
            Phone: order.Phone,
            ShippingDestination: order.ShippingDestination,
            ShippingProductCode: order.ShippingProductCode,
            ShippingDueDay: order.ShippingDueDay,
            TotalShippingFee: order.TotalShippingFee,
            OrderDetails: []
        };

        for (var i = 0, length = order.OrderDetails.length; i < length; i++) {
            var detail = order.OrderDetails[i];
            orderToBeUpdated.OrderDetails.push({
                Code: detail.Code,
                OrderCode: detail.OrderCode,
                ProductCode: detail.ProductCode,
                DealerCode: detail.DealerCode,
                Quantity: detail.Quantity
            });
        }

        OrderService.updateDraft(orderToBeUpdated)
            .then(function (res) {
                $state.go('app.order-payment', { code: order.Code });
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingUpdateDraft = false;
            });
    }

    function back() {
        $window.history.back();
    }

    function voidDraft(code) {
        if (confirm('Are you sure want to void this data?')) {
            vm.loadingVoidDraft = true;
            OrderService.voidDraft(code)
                .then(function (res) {
                    toastr.info('Order has been voided');
                    $state.go('app.order.draft');
                })
                .catch(function (res) {
                    toastr.error(err);
                })
                .finally(function () {
                    vm.loadingVoidDraft = false;
                });
        }

    }

    function getLocations(keyword) {
        return ShippingService.getLocations(vm.currentUser.kiosk.branchCode, keyword)
            .then(function (result) {
                return result;
            }, function (response) {

            });
    }

    function selectPricingOption(pricingOption) {
        vm.pricingOption = pricingOption;
        vm.order.ShippingProductCode = pricingOption.productCode;
        vm.order.ShippingDestination = vm.destination.display;
        vm.order.ShippingDueDay = vm.pricingOption.dueDay;

        calculate();
    }

    function updateDetail(detail) {
        calculate();
    }

    function calculate() {
        if (!vm.order.SelfPickUp)
        {
            var grouped = groupByArray(vm.order.OrderDetails, 'DealerCode');

            var totalWeight = 0;
            for (var i = 0; i < grouped.length; i++) {
                for (var j = 0; j < grouped[i].values.length; j++) {
                    totalWeight += grouped[i].values[j].Product.Weight * grouped[i].values[j].Quantity;
                }
            }

            vm.order.TotalShippingFee = totalWeight * vm.pricingOption.minPrice;
        }
        else {
            vm.orderTotalShippingFee = 0;
        }

        var totalPrice = 0;
        for (var i = 0, length = vm.order.OrderDetails.length; i < length; i++) {
            totalPrice += vm.order.OrderDetails[i].Quantity * vm.order.OrderDetails[i].Product.Price;
        }
        vm.order.TotalPrice = totalPrice;
    }

    function removeCurrentShippingInformation() {
        vm.order.ShippingDestination = '';
        vm.order.ShippingProductCode = '';
        vm.order.ShippingDueDay = 0;
        vm.order.TotalShippingFee = 0;
    }

    (function () {
        var code = $stateParams.code;
        if (!code) {
            $state.go('app.order');
        }
        getOrderByCode(code);
    })();

    function groupByArray(xs, key) { return xs.reduce(function (rv, x) { let v = key instanceof Function ? key(x) : x[key]; let el = rv.find((r) => r && r.key === v); if (el) { el.values.push(x); } else { rv.push({ key: v, values: [x] }); } return rv; }, []); }
}