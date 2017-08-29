'use strict';

angular.module('app.authentication')
    .controller('LoginController', LoginController);

LoginController.$inject = ['AuthenticationService', 'AuthenticationState', '$localStorage', '$state'];

function LoginController(AuthenticationService, AuthenticationState, $localStorage, $state) {
    var vm = this;

    vm.user = {
        email: '',
        password: ''
    };

    vm.login = login;
    
    function login(user) {
        // belum ada login
        AuthenticationState.SetUser({
            username: 'adythia',
            initial: 'ADY'
        });
        $state.go('main.dashboard');
        // belum ada login
        

        vm.loading = true;
        vm.message = '';

        AuthenticationService.SignIn(user)
            .then(function (response) {
                if (response.status === 'fail' || response.status === 'error') {
                    vm.message = response.message;
                    return;
                }

                AuthenticationState.SetToken(response.data.token);

                return AuthenticationService.GetAuthenticatedUser();
            })
            .then(function (response) {
                if (response.status === 'fail' || response.status === 'error') {
                    vm.message = response.message;
                    return;
                }

                var result = response.data;

                AuthenticationState.SetUser(result.user);

                $state.go('main.dashboard');
            })
            .catch(function (response) {
                
            })
            .finally(function () {
                vm.loading = false;
            });
    }
}