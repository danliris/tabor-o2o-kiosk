﻿angular.module('app')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$state', '$stateParams', '$timeout', '$q', 'toastr', 'Order', 'BrandService', 'CategoryService', 'AuthenticationService', 'AuthenticationState', 'NotificationService', 'WalletService', '$uibModal', '$window', '$rootScope'];
function HeaderController($state, $stateParams, $timeout, $q, toastr, Order, BrandService, CategoryService, AuthenticationService, AuthenticationState, NotificationService, WalletService, $uibModal, $window, $rootScope) {
    var vm = this;

    var refreshTime = 600;
    vm.ticks = refreshTime;
    vm.totalItemsOnCart = 0;
    vm.searchProduct = searchProduct;
    vm.keyword = $stateParams.keyword;

    vm.removeOrderItem = removeOrderItem;
    vm.logout = logout;
    vm.trackOrder = trackOrder;
    vm.openModalChangePassword = openModalChangePassword;
    vm.openModalChangeMode = openModalChangeMode;
    vm.getWalletBalance = getWalletBalance;

    (function () {
        //getBrands();
        getCategories();

        var currentOrder = Order.getCurrentOrder();
        vm.cartItems = currentOrder.items;

        vm.authenticatedUser = AuthenticationState.getUser();

        vm.isStaff = AuthenticationState.isStaff();

        vm.notifications = [];

        getNotifications();

        getWalletBalance();

        ticking();
    })();

    function ticking() {

        vm.ticks--;
        if (vm.ticks == 0) {
            getNotifications();
            vm.ticks = refreshTime;
        }

        $timeout(ticking, 1000);
    }

    function getNotifications() {
        var promises = [];
        promises.push(getUnreadNotifications(initNotificationQuery()));
        promises.push(getTotalUnreadNotifications());

        vm.loadingGetUnreadNotifications = true;
        $q.all(promises)
            .then(responses => {
                var response = responses[0];
                vm.notifications = response;

                response = responses[1];
                vm.totalUnreadNotifications = response.count;
            })
            .catch(err => { })
            .finally(() => {
                vm.loadingGetUnreadNotifications = false;
            });
    }

    function getCategories() {
        CategoryService.getByBrandCode('SMG')
            .then(function (response) {
                vm.categories = response;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
            });
    }

    //function getBrands() {
    //    BrandService.getAll()
    //        .then(function (response) {
    //            vm.brands = response;
    //        })
    //        .catch(function (err) {
    //            toastr.error(err);
    //        })
    //        .finally(function () {
    //        });
    //}

    function searchProduct(keyword) {
        if (keyword)
            $state.go('app.product', { keyword: keyword, brand: '', category: '*' });
    }

    function removeOrderItem(item) {
        if (confirm('Apakah anda yakin untuk membatalkan transaksi item ini?')) {
            Order.removeOrderItem(item);
            toastr.warning('Item telah dihapus dari transaksi ini', 'Pesan');
        }
    }

    function getUnreadNotifications(query) {
        return NotificationService.getAllUnreadByUserId(vm.authenticatedUser.id, query);
    }

    function getTotalUnreadNotifications() {
        return NotificationService.getTotalUnreadNotifications(vm.authenticatedUser.id)
    }

    function logout() {
        AuthenticationService.signOut()
        AuthenticationState.remove();
        Order.initiateOrder();

        $state.go('authentication.login');
    }

    function getWalletBalance() {
        vm.loadingGetWalletBalance = true;
        return WalletService.getWalletBalance(vm.authenticatedUser.email)
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

    function initNotificationQuery() {
        return {
            keyword: '',
            orderBy: '-NotifiedDate',
            page: 1,
            limit: 9
        };
    }

    function trackOrder(notification) {
        // kalo udah pernah, ga usah patch data lagi
        if (notification.IsRead) {
            var data = JSON.parse(notification.Data);
            $state.go('app.order.track', { code: data.orderCode });
            return;
        }

        if (notification.loading)
            return;

        notification.loading = true;

        NotificationService.setRead(notification.id)
            .then(res => {
                var data = JSON.parse(notification.Data);
                $state.go('app.order.track', { code: data.orderCode }, { reload: true });
                return;
            })
            .catch(err => { })
            .finally(() => {
                notification.loading = false;
            });
    }

    function openModalChangePassword() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/authentication/change-password.modal.html',
            controller: 'ChangePasswordModalController',
            controllerAs: 'vm',
            size: 'sm'
        });

        modalInstance.result.then((result) => {

        });
    }

    function openModalChangeMode() {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/authentication/change-mode.modal.html',
            controller: 'ChangeModeModalController',
            controllerAs: 'vm',
            size: 'sm'
        });

        modalInstance.result.then((result) => {
            $window.location.reload();
        });
    }
}

