angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    //'ngSanitize',
    'ngStorage',
    'fcsa-number',
    //'ngAnimate',
    'toastr',

    'app.authentication' // bukan library
]);

angular.module('app')
    .factory('httpInterceptor', httpInterceptor);

httpInterceptor.$inject = [
    '$q',
    '$rootScope',
    '$location'
];

function httpInterceptor($q, $rootScope, $localStorage, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            //config.params = [];

            if ($localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }

            return config;
        },

        responseError: function (rejection) {
            //if (rejection.data.error === 'token_not_provided' || rejection.data.error === 'token_expired') {
            //    $location.path('/login');
            //}
            console.log(rejection);

            if (rejection.data) {
                if (rejection.data.error) {
                    return $q.reject(rejection.data.error.statusCode + ' - ' + rejection.data.error.message);
                }
            }

            return $q.reject(rejection.status + ' - ' + rejection.statusText);
        }
    };
}


angular
    .module('app')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);

angular
    .module('app')
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

angular
    .module('app')
    .factory('settings', settings);

settings.$inject = [
    '$rootScope'
];

function settings($rootScope) {
    var settings = {
        pageTitle: 'O2O',
        cartOpen: false,
        toggleCartOpen: toggleCartOpen
    };

    function toggleCartOpen() {
        this.cartOpen = !this.cartOpen;
    }

    return settings;
}

angular
    .module('app')
    .run(runBlock);

runBlock.$inject = [
    '$rootScope',
    '$state',
    '$transitions',
    'settings',
    'AuthenticationState'
];

function runBlock($rootScope, $state, $transitions, settings, AuthenticationState) {
    $rootScope.$settings = settings;

    $transitions.onStart({}, function (trans) {
        if (!AuthenticationState.isLoggedIn()) {
            $state.go('authentication.login');
        }

        // check authorized user
        var stateData = trans.$to().data;
        if (stateData.authorizedRoles)
        {
            var currentUser = AuthenticationState.getUser();
            var authorized = false;
            for (var i = 0, length = stateData.authorizedRoles.length; i < length; i++) {
                authorized = authorized || (currentUser.roles.find(x => x.name == stateData.authorizedRoles[i]) ? true : false);
            }
            if (!authorized) {
                $state.go('app.home');
            }
        }

        $rootScope.$settings.pageTitle = stateData.pageTitle;
        $rootScope.$settings.cartOpen = false;
    });
}