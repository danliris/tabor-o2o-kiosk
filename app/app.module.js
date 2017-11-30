angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    //'ngSanitize',
    'ngStorage',
    'fcsa-number',
    // 'ngAnimate',
    'toastr',
    'ngTouch',
    'firebase',
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

            // if ($localStorage.token) {
            //     config.headers.access_token = $localStorage.token;
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
    .config(['$localStorageProvider', function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('jet-o2o-');
    }]);

angular
    .module('app')
    .config(() => {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyD1NNv6unTGmyCb8ESkoA_Z3Qxh1qZIaTA",
            authDomain: "o2o-dev.firebaseapp.com",
            databaseURL: "https://o2o-dev.firebaseio.com",
            projectId: "o2o-dev",
            storageBucket: "o2o-dev.appspot.com",
            messagingSenderId: "174807202396"
        };
        firebase.initializeApp(config);
    });

angular
    .module('app')
    .factory('settings', settings);

settings.$inject = [
    '$rootScope'
];

function settings($rootScope) {
    var settings = {
        pageTitle: 'O2O',
        firebaseReady: false,
        walletBalance: 0
    };

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
                // authorized = authorized || (currentUser.roles.find(x => x.name == stateData.authorizedRoles[i]) ? true : false);

                authorized = authorized || (AuthenticationState.getRole() == stateData.authorizedRoles[i] ? true : false);
            }


            if (!authorized) {
                $state.go('app.home');
            }
        }

        $rootScope.$settings.pageTitle = stateData.pageTitle;
    });
}