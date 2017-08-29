angular
    .module('app')
    .service('ProductService', ProductService);

ProductService.$inject = ['$http', 'Urls'];

function ProductService($http, Urls) {
    return {
        getAll: getAll
    };

    function getAll(query) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'Name': {
                    like: '%' + query.keyword + '%'
                }
            }
        };

        return $http.get(Urls.BASE_API + '/products', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess, handleError('Error getting all products'));
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