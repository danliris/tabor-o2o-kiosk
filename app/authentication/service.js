angular.module('app.authentication').service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = [
    '$http',
    '$localStorage',
    'Urls'
];
function AuthenticationService($http, $localStorage, Urls) {
    var currentUser;
    var tokenClaims = GetClaimsFromToken();

    return {
        SignIn: SignIn,
        SignUp: SignUp,
        SignOut: SignOut,
        GetClaimsFromToken: GetClaimsFromToken,
        GetAuthenticatedUser: GetAuthenticatedUser
    };

    function SignIn(user) {
        return $http.post(Urls.BASE_API + '/authenticate', user)
            .then(handleSuccess, handleError('Error signing in'));
    }

    function SignUp() {
        // body...
    }

    function SignOut() {
        tokenClaims = {};
    }

    function GetClaimsFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    function GetAuthenticatedUser() {
        return $http.get(Urls.BASE_API + '/authenticate/user')
            .then(handleSuccess, handleError('Error getting authenticated user'));
    }

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return window.atob(output);
    }


    function handleSuccess(res) {
        return res.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }

}