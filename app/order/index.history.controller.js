angular.module('app')
    .controller('OrderHistoryController', OrderHistoryController);

OrderHistoryController.$inject = ['OrderService', '$uibModal', '$q', 'AuthenticationState'];
function OrderHistoryController(OrderService, $uibModal, $q, AuthenticationState) {
    var vm = this;
    vm.changePage = changePage;
    vm.openDetail = openDetail;
    vm.currentUser = AuthenticationState.getUser();

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
            OrderService.getAllHistory(query, vm.currentUser.kiosk.code)
                .then(function (response) {
                    vm.orders = response;
                })
        );

        promises.push(
            OrderService.countAllHistory(query, vm.currentUser.kiosk.code)
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

    function openDetail(code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/order/detail.modal.html',
            controller: 'OrderDetailModalController',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                code: function () {
                    return code;
                }
            }
        });
    }

    (function () {
        vm.orders = [];
        vm.orderQuery = initQuery();

        getOrders(vm.orderQuery);
    })();
}