angular
    .module('app')
    .service('WalletService', WalletService);

WalletService.$inject = ['$http', 'Urls'];

function WalletService($http, Urls) {
    return {
        getWalletBalance: getWalletBalance
    }

    function getWalletBalance(email) {
        return $http.get(`${Urls.BASE_API}/orders/wallets/${email}`)
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}