angular.module('app')
    .controller('NotificationController', NotificationController);

NotificationController.$inject = ['$state', '$q', 'AuthenticationState', 'NotificationService'];
function NotificationController($state, $q, AuthenticationState, NotificationService) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.getNotifications = getNotifications;
    vm.next = next;
    vm.trackOrder = trackOrder;

    (function () {
        vm.query = initQuery();
        getNotifications(vm.query);
    })();

    function initQuery() {
        return {
            keyword: '',
            orderBy: '-NotifiedDate',
            page: 1,
            limit: 25
        };
    }

    function getNotifications(query) {
        vm.isError = false;
        vm.loadingGetNotifications = true;
        vm.notifications = vm.notifications || [];

        var promises = [];
        promises.push(
            NotificationService.getAllByUserId(vm.currentUser.id, query)
        );

        promises.push(
            NotificationService.countAllByUserId(vm.currentUser.id, query)
        );

        $q.all(promises)
            .then(responses => {
                var notifications = responses[0];
                notifications.forEach(notification => {
                    vm.notifications.push(notification);
                });

                var response = responses[1];
                query.count = response.count;
            })
            .catch(err => { vm.isError = true })
            .finally(() => {
                vm.loadingGetNotifications = false;
            });
    }

    function next() {
        vm.query.page++;
        getNotifications(vm.query);
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
}