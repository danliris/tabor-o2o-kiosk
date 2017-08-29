angular.module('app.authentication').factory('AuthenticationState', AuthenticationState);
AuthenticationState.$inject = [
    '$http',
    '$localStorage'
];
function AuthenticationState($http, $localStorage) {
    return {
        SetToken: SetToken,
        GeToken: GetToken,
        SetUser: SetUser,
        GetUser: GetUser,
        IsLoggedIn: IsLoggedIn,

        Remove: Remove
    }

    function SetUser(user) {
        $localStorage.user = user;
    }

    function GetUser() {
        return $localStorage.user;
    }

    function SetToken(token) {
        $localStorage.token = token;
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    }

    function GetToken() {
        return $localStorage.token;
    }

    function IsLoggedIn() {
        return $localStorage.user ? true : false;
    }

    function Remove() {
        delete $localStorage.token;
        delete $localStorage.user;
        delete $http.defaults.headers.common.Authorization;
    }
}