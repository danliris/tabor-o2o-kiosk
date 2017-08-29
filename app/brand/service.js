angular
    .module('app')
    .service('BrandService', BrandService);

BrandService.$inject = ['$http', 'Urls'];

function BrandService($http, Urls) {
    return {
        getAll: getAll
    };

    function getAll(query) {
        return $http.get(Urls.BASE_API + '/brands')
            .then(handleSuccess, handleError('Error getting all brands'));
    }

    function handleSuccess(response) {
        return response.data;
    }

    function handleError(error) {
        return function () {
            return { success: false, message: error };
        };
    }
}