angular.module('app')
    .service('ShippingService', ShippingService);

ShippingService.$inject = ['$http', 'Urls'];
function ShippingService($http, Urls) {
    return {
        getPricings: getPricings,
        getLocations: getLocations,
        getWeightRoundingLimit: getWeightRoundingLimit
    };

    function getPricings(origin, destination, weight) {
        var data = {
            origin: origin,
            destination: destination,
            weight: weight
        };
        return $http.post(Urls.BASE_API + '/orders/shipping/pricings', data)
            .then(handleSuccess);
    }

    function getLocations(keyword) {
        return $http.get(Urls.BASE_API + '/orders/shipping/locations', { params: { keyword: keyword } })
            .then(handleSuccess);
    }

    function getWeightRoundingLimit() {
        return $http.get(Urls.BASE_API + '/orders/shipping/weightroundinglimit')
            .then(handleSuccess);
    }

    function handleSuccess(res) {
        return res.data;
    }
}