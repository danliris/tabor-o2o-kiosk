angular.module('app')
    .controller('OrderDetailController', OrderDetailController);

OrderDetailController.$inject = ['$state', '$rootScope', '$filter', '$window', '$stateParams', 'AuthenticationState', 'OrderService', 'ShippingService', 'toastr'];
function OrderDetailController($state, $rootScope, $filter, $window, $stateParams, AuthenticationState, OrderService, ShippingService, toastr) {
    var vm = this;

    var weightRoundingLimit = 0.3;// default

    vm.order = {};
    vm.currentUser = AuthenticationState.getUser();

    vm.toggleSelfPickUp = toggleSelfPickUp;
    vm.updateDraft = updateDraft;
    vm.back = back;
    vm.voidDraft = voidDraft;
    vm.getLocations = getLocations;
    vm.selectLocation = selectLocation;
    vm.selectPricingOption = selectPricingOption;
    vm.updateDetail = updateDetail;
    vm.removeCurrentShippingInformation = removeCurrentShippingInformation;
    vm.calculate = calculate;

    function toggleSelfPickUp(val) {
        if (val) {
            vm.order.Address = vm.currentUser.kiosk.address;

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
                if (res.Status != 'DRAFTED') {
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
        if (confirm('Apakah Anda yakin untuk membatalkan pesanan ini?')) {
            vm.loadingVoidDraft = true;
            OrderService.voidDraft(code)
                .then(function (res) {
                    toastr.info('Pesanan telah dibatalkan.');
                    $state.go('app.order.draft');
                })
                .catch(function (err) {
                    toastr.error(err);
                })
                .finally(function () {
                    vm.loadingVoidDraft = false;
                });
        }

    }

    function getLocations(keyword) {
        return ShippingService.getLocations(keyword)
            .then(res => {
                return res.result;
            });
    }

    function selectLocation(destination) {
        vm.loadingPricings = true;
        ShippingService.getPricings(vm.currentUser.kiosk.branchName, destination, 1)
            .then(res => {
                vm.pricingOptions = res.result[0].pricingOptions;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingPricings = false;
            })
    }

    function selectPricingOption(pricingOption) {
        vm.pricingOption = pricingOption;
        vm.order.ShippingProductCode = pricingOption.productCode;
        vm.order.ShippingDestination = vm.destination.display;
        vm.order.ShippingDueDay = pricingOption.dueDay;

        calculate();
    }

    function updateDetail(detail) {
        detail.ShippingFee = (vm.pricingOption) ? vm.pricingOption.calculationResult : 0;

        calculate();
    }

    function calculate() {
        vm.order.TotalShippingFee = 0;
        vm.order.TotalPrice = 0;

        if (!vm.order.SelfPickUp) {
            // Set buat distinct value, Array.from buat convert Set > Array
            var dealerCodes = Array.from(new Set(vm.order.OrderDetails.map(t => t.DealerCode)));

            for (var i = 0, length = dealerCodes.length; i < length; i++) {
                var weight = vm.order.OrderDetails
                    .filter(t => t.DealerCode == dealerCodes[i]) // filter by dealer code
                    .map(t => t.Quantity * t.Product.Weight) // bikin array baru yang isinya berat * quantity
                    .reduce((a, b) => { return a + b }); // total berat

                // pembulatan
                if (weight == 0)
                    weight = 0;
                else if (weight < 1)
                    weight = 1;
                else if (weight - Math.floor(weight) > weightRoundingLimit)
                    weight = Math.ceil(weight);
                else
                    weight = Math.floor(weight);

                vm.order.TotalShippingFee += weight * vm.pricingOption.calculationResult;
            }
        }

        for (var i = 0, length = vm.order.OrderDetails.length; i < length; i++) {
            vm.order.TotalPrice += vm.order.OrderDetails[i].Quantity * vm.order.OrderDetails[i].Product.Price;
        }
    }

    function removeCurrentShippingInformation() {
        delete vm.pricingOption;
        vm.order.ShippingDestination = '';
        vm.order.ShippingProductCode = '';
        vm.order.ShippingDueDay = 0;
        vm.order.TotalShippingFee = 0;
    }

    function getWeightRoundingLimit() {
        return ShippingService.getWeightRoundingLimit()
            .then(res => {
                weightRoundingLimit = res.result;
            });
    }

    (function () {
        var code = $stateParams.code;
        if (!code) {
            $state.go('app.order');
        }
        getOrderByCode(code);
        getWeightRoundingLimit();
    })();

    function groupByArray(xs, key) { return xs.reduce(function (rv, x) { let v = key instanceof Function ? key(x) : x[key]; let el = rv.find((r) => r && r.key === v); if (el) { el.values.push(x); } else { rv.push({ key: v, values: [x] }); } return rv; }, []); }
}