'use strict';

angular.module('app.authentication')
    .controller('ChangeModeModalController', ChangeModeModalController);

ChangeModeModalController.$inject = ['AuthenticationService', 'AuthenticationState', '$uibModalInstance', 'toastr'];

function ChangeModeModalController(AuthenticationService, AuthenticationState, $uibModalInstance, toastr) {
    var vm = this;
    vm.authenticatedUser = AuthenticationState.getUser();
    vm.verifyUser = verifyUser;
    vm.toGuestMode = toGuestMode;

    (function () {
        vm.data = {
            email: vm.authenticatedUser.email,
            password: ''
        };
    })();

    function verifyUser(data) {
        vm.verifying = true;

        return AuthenticationService.signIn(data)
            .then(res => {
                if (AuthenticationState.isGuest()) {
                    // toastr.success('Switched to staff mode');
                    AuthenticationState.setRole('staff');
                } else if (AuthenticationState.isStaff()) {
                    // toastr.success('Switched to guest mode');
                    AuthenticationState.setRole('guest');
                }

                $uibModalInstance.close();
            })
            .catch(error => {
                toastr.error(error);
            })
            .finally(() => {
                vm.verifying = false;
            });
    }

    function toGuestMode() {
        AuthenticationState.setRole('guest');
        $uibModalInstance.close();
    }

}