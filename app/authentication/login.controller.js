'use strict';

angular.module('app.authentication')
    .controller('LoginController', LoginController);

LoginController.$inject = ['AuthenticationService', 'AuthenticationState', '$q', '$state'];

function LoginController(AuthenticationService, AuthenticationState, $q, $state) {
    var vm = this;

    vm.user = {
        email: '',
        password: ''
    };

    vm.login = login;

    function login(user) {
        vm.loading = true;
        vm.message = '';
        var authenticatedUser = {};

        AuthenticationService.signIn(user)
            .then(function (res) {
                AuthenticationState.setToken(res);

                var promises = [];
                promises.push(AuthenticationService.getAuthenticatedUser(res.userId));
                promises.push(AuthenticationService.getKioskUser(res.userId));
                promises.push(AuthenticationService.getRoleUser(res.userId));

                return $q.all(promises);
            })
            .then(function (responses) {
                // hasil dari get authenticated user
                var response = responses[0];
                authenticatedUser.id = response.id;
                authenticatedUser.email = response.email;
                authenticatedUser.username = response.username;

                // hasil dari kiosk user
                response = responses[1];
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

                // get user role
                response = responses[2];
                if (response.length == 0) {
                    throw 'Unauthorized';
                }
                authenticatedUser.roles = [];
                for (var i = 0, length = response.length; i < length; i++) {
                    authenticatedUser.roles.push(response[i].role);
                }

                AuthenticationState.setUser(authenticatedUser);

                $state.go('app.home');
            })
            .catch(function (err) {
                vm.message = err;
                AuthenticationState.remove();
            })
            .finally(function () {
                vm.loading = false;
            });
    }
}