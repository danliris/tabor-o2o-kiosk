angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    //'ngSanitize',
    'ngStorage',
    'fcsa-number',
    //'ngAnimate',
    'toastr',
    'ngTouch',
    'app.authentication' // bukan library
]);

angular.module('app')
    .factory('httpInterceptor', httpInterceptor);

httpInterceptor.$inject = [
    '$q',
    '$rootScope',
    '$localStorage'
];

function httpInterceptor($q, $rootScope, $localStorage) {
    return {
        request: function (config) {
            // !@#$##@#$
            // config.params = config.params || {};
            // if ($localStorage.token) {
            //     config.params.access_token = $localStorage.token;
            // }

            return config;
        },

        responseError: function (rejection) {
            console.warn(rejection);

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
    .config(['$localStorageProvider', function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('jet-o2o-');
    }]);

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
        // cartOpen: false,
        // notificationOpen: false,
        // toggleCartOpen: toggleCartOpen,
        // toggleNotificationOpen: toggleNotificationOpen
    };

    // function toggleCartOpen() {
    //     this.cartOpen = !this.cartOpen;
    //     this.notificationOpen = false;
    // }

    // function toggleNotificationOpen() {
    //     this.notificationOpen = !this.notificationOpen;
    //     this.cartOpen = false;
    // }

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
        if (stateData.authorizedRoles) {
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
        // $rootScope.$settings.cartOpen = false;
    });
}