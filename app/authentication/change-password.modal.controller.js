'use strict';

angular.module('app.authentication')
    .controller('ChangePasswordModalController', ChangePasswordModalController);

ChangePasswordModalController.$inject = ['AuthenticationService', 'AuthenticationState', '$uibModalInstance', 'toastr'];

function ChangePasswordModalController(AuthenticationService, AuthenticationState, $uibModalInstance, toastr) {
    var vm = this;
    vm.changePassword = changePassword;

    (function () {
        vm.data = {
            oldPassword: '',
            newPassword: '',
            retypeNewPassword: ''
        };
    })();

    function changePassword(data) {
        vm.loadingChangePassword = true;
        return AuthenticationService.changePassword(data)
            .then(response => {
                toastr.success('Password berhasil diubah');
                $uibModalInstance.close();
            })
            .catch(error => {
                toastr.error(error);
            })
            .finally(() => { vm.loadingChangePassword = false });
    }

}