angular.module('app')
    .controller('OrderDraftController', OrderDraftController);

OrderDraftController.$inject = ['OrderService', 'toastr', '$q', 'AuthenticationState'];
function OrderDraftController(OrderService, toastr, $q, AuthenticationState) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.changePage = changePage;
    vm.getOrders = getOrders;

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
        promises.push(OrderService.getAllDraft(query, vm.currentUser.kiosk.code));

        promises.push(OrderService.countAllDraft(query, vm.currentUser.kiosk.code));

        vm.loadingGetOrders = true;
        vm.isError = false;

        $q.all(promises)
            .then(function (responses) {
                var response = responses[0];
                vm.orders = response;

                response = responses[1];
                vm.orderQuery.count = response.count;
            })
            .catch(function (err) {
                vm.isError = true;
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