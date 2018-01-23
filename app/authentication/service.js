angular.module('app.authentication').service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = [
    '$http',
    'Urls'
];
function AuthenticationService($http, Urls) {
    var currentUser;

    return {
        signIn: signIn,
        signOut: signOut,
        getAuthenticatedUser: getAuthenticatedUser,
        getKioskUser: getKioskUser,
        getRoleUser: getRoleUser,
        changePassword: changePassword
    };

    function signIn(user) {
        return $http.post(Urls.BASE_API + '/users/login', user)
            .then(handleSuccess);
    }

    function signOut() {
        return $http.post(Urls.BASE_API + '/users/logout')
            .then(handleSuccess);
    }

    function getAuthenticatedUser(id) {
        return $http.get(Urls.BASE_API + '/users/' + id)
            .then(handleSuccess);
    }

    function getKioskUser(id) {
        var q = {
            filter: {
                where: {
                    'UserId': id
                },
                include: [
                    'Kiosk'
                ]
            }
        }

        return $http.get(Urls.BASE_API + '/kioskusers?' + $.param(q))
            .then(handleSuccess);
    }

    function getRoleUser(id) {
        var q = {
            filter: {
                where: {
                    principalType: 'USER',
                    principalId: id
                },
                include: {
                    relation: 'role'
                }
            }
        }

        return $http.get(Urls.BASE_API + '/rolemappings?' + $.param(q))
            .then(handleSuccess);
    }

    function changePassword(user) {
        return $http.post(`${Urls.BASE_API}/users/change-password`, user)
            .then(handleSuccess);
    }

    function handleSuccess(res) {
        return res.data;
    }

}