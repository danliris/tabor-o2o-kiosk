angular.module('app')
    .controller('OrderDraftController', OrderDraftController);

OrderDraftController.$inject = ['OrderService', 'toastr', '$q', 'AuthenticationState'];
function OrderDraftController(OrderService, toastr, $q, AuthenticationState) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.changePage = changePage;

    function initQuery() {
        return {
            keyword: '',
            orderBy: '-CreatedDate',
            page: 1,
            limit: 9
        };
    }

    function getOrders(query) {
        var promises = [];
        promises.push(
            OrderService.getAllDraft(query, vm.currentUser.kiosk.code)
                .then(function (res) {
                    vm.orders = res;
                })
            );

        promises.push(
            OrderService.countAllDraft(query, vm.currentUser.kiosk.code)
                .then(function (res) {
                    vm.orderQuery.count = res.count;
                })
            );

        vm.loadingGetOrders = true;
        $q.all(promises)
            .then(function (res) {
            })
            .catch(function (err) {
            })
            .finally(function () {
                vm.loadingGetOrders = false;
            });

    }

    function changePage() {
        getOrders(vm.orderQuery);
    }

    (function () {
        vm.orders = [];
        vm.orderQuery = initQuery();

        getOrders(vm.orderQuery);
    })();
}