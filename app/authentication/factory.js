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
        remove: remove,
        setRole: setRole,
        getRole: getRole,
        isGuest: isGuest,
        isStaff: isStaff,
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
        $localStorage.$reset();
        delete $http.defaults.headers.common.Authorization;
    }

    function setUser(user) {
        $localStorage.user = user;
    }

    function getUser() {
        return $localStorage.user;
    }

    function setRole(role) {
        $localStorage.user.role = role;
    }

    function getRole() {
        return $localStorage.user.role;
    }

    function isGuest() {
        // if ($localStorage.user.roles)
        //     return $localStorage.user.roles.find(x => x.name == 'guest') ? true : false;
        if ($localStorage.user.role)
            return $localStorage.user.role == 'guest' ? true : false;
        return false;
    }

    function isStaff() {
        // if ($localStorage.user.roles)
        //     return $localStorage.user.roles.find(x => x.name == 'staff') ? true : false;
        if ($localStorage.user.role)
            return $localStorage.user.role == 'staff' ? true : false;

        return false;

    }
}