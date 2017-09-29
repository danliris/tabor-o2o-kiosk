angular
    .module('app')
    .service('CategoryService', CategoryService);

CategoryService.$inject = ['$http', 'Urls'];

function CategoryService($http, Urls) {
    return {
        getByBrandCode: getByBrandCode
    };

    function getByBrandCode(brandCode) {
        var q = {
            where: {
                'BrandCode': brandCode
            }
        };

        return $http.get(Urls.BASE_API + '/productcategories', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}