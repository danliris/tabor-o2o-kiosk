angular.module('app')
    .service('ShippingService', ShippingService);

ShippingService.$inject = ['$http', 'Urls'];
function ShippingService($http, Urls) {
    return {
        getLocations: getLocations
    };

    function getLocations(branchCode, keyword) {
        return $http.get(Urls.JET_API + '/v2/location/' + branchCode + '?keyword=' + keyword)
            .then(handleSuccess);
    }

    function handleSuccess(res) {
        return res.data;
    }
}