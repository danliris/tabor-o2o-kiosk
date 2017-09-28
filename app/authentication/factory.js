angular.module('app.authentication').factory('AuthenticationState', AuthenticationState);
AuthenticationState.$inject = [
    '$http',
    '$localStorage'
];
function AuthenticationState($http, $localStorage) {
    return {
        setToken: setToken,
        getToken: getToken,
        setUser: setUser,
        getUser: getUser,
        isLoggedIn: isLoggedIn,
        remove: remove
    }

    function setToken(token) {
        $localStorage.token = token.id;
        $localStorage.tokenExpiredAt = new Date(new Date(token.created) + token.ttl);
        $http.defaults.headers.common.Authorization = token.id;
    }

    function getToken() {
        return $localStorage.token;
    }

    function isLoggedIn() {
        return $localStorage.user ? true : false;
    }

    function remove() {
        delete $localStorage.token;
        delete $localStorage.user;
        delete $http.defaults.headers.common.Authorization;
    }

    function setUser(user) {
        $localStorage.user = user;
    }

    function getUser() {
        return $localStorage.user;
    }
}