angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    //'ngSanitize',
    'ngStorage',

    //'app.authentication' // bukan library
]);

angular.module('app')
    .factory('httpInterceptor', httpInterceptor);

httpInterceptor.$inject = [
    '$q',
    '$rootScope',
    //'$localStorage',
    '$location'
];

function httpInterceptor($q, $rootScope, $localStorage, $location) {
    return {
        request: function (config) {
            config.headers = config.headers || {};

            if ($localStorage.token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.token;
            }

            return config;
        },

        responseError: function (rejection) {
            if (rejection.data.error === 'token_not_provided' || rejection.data.error === 'token_expired') {
                $location.path('/login');
            }

            return $q.reject(rejection);
        }
    };
}


angular
    .module('app')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);

//// RUN BLOCK. GLOBAL INJECTION
//angular
//    .module('app')
//    .run(runBlock);

//runBlock.$inject = [
//    '$rootScope',
//    '$state',
//    'AuthenticationState'
//];

//function runBlock($rootScope, $state, AuthenticationState) {
//    //$rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

//    //    if (toState.name === 'authentication.login')
//    //        return;

//    //    if (AuthenticationState.IsLoggedIn())
//    //        return;

//    //    e.preventDefault();
//    //    $state.go('authentication.login', {}, { notify: true });
//    //});


//}

angular
    .module('app')
    .run(runBlock);

runBlock.$inject = [
    '$rootScope',
    '$state'
];

function runBlock($rootScope, $state) {

}