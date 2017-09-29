angular
    .module('app')
    .service('BrandService', BrandService);

BrandService.$inject = ['$http', 'Urls'];

function BrandService($http, Urls) {
    return {
        getAll: getAll
    };

    function getAll() {
        return $http.get(Urls.BASE_API + '/brands')
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}