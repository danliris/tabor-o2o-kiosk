'use strict';

angular.module('app.authentication')
    .controller('LoginController', LoginController);

LoginController.$inject = ['AuthenticationService', 'AuthenticationState', '$localStorage', '$state'];

function LoginController(AuthenticationService, AuthenticationState, $localStorage, $state) {
    var vm = this;

    vm.user = {
        email: 'ben.hardi@moonlay.com',
        password: '12345'
    };

    vm.login = login;

    function login(user) {
        vm.loading = true;
        vm.message = '';
        var authenticatedUser = {};

        AuthenticationService.signIn(user)
            .then(function (response) {
                AuthenticationState.setToken(response);

                return AuthenticationService.getAuthenticatedUser(response.userId);
            })
            .then(function (response) {
                authenticatedUser.id = response.id;
                authenticatedUser.email = response.email;
                authenticatedUser.username = response.username;

                return AuthenticationService.getKioskUser(authenticatedUser.id);
            })
            .then(function (response) {
                if (response.length == 0) {
                    throw 'User ini tidak berada di kiosk manapun.';
                }
                
                var kiosk = response[0].Kiosk;
                authenticatedUser.kiosk = {
                    code: kiosk.Code,
                    name: kiosk.Name,
                    address: kiosk.Address,
                    phone: kiosk.PhoneNumber,
                    branchCode: kiosk.BranchCode,
                    branchName: kiosk.BranchName,
                };

                AuthenticationState.setUser(authenticatedUser);

                $state.go('app.home');
            })
            .catch(function (err) {
                console.log(err);
                vm.message = err;
            })
            .finally(function () {
                vm.loading = false;
            });
    }
}