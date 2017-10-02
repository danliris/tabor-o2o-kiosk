angular
    .module('app')
    .service('ProductService', ProductService);

ProductService.$inject = ['$http', 'Urls'];

function ProductService($http, Urls) {
    return {
        getAll: getAll,
        getByCode: getByCode,
        countAll: countAll,
    };

    function getAll(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'Name': {
                    like: '%' + (query.keyword || '') + '%'
                },
                'BrandCode': query.brandCode,
                'ProductCategoryCode': query.categoryCode,
                'KioskCode': kioskCode,
            }
        };

        return $http.get(Urls.BASE_API + '/vmappedproducts', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAll(query, kioskCode) {
        var q = {
            //where: {
            'Name': {
                like: '%' + (query.keyword || '') + '%'
            },
            'BrandCode': query.brandCode,
            'ProductCategoryCode': query.categoryCode,
            'KioskCode': kioskCode
            //}
        };
        //return $http.get(Urls.BASE_API + '/vmappedproducts/count?' + $.param(q))
        //    .then(handleSuccess);

        //return $http.get(Urls.BASE_API + '/vmappedproducts/count', { params: { filter: JSON.stringify(q) } })
        //   .then(handleSuccess);

        return $http.get(Urls.BASE_API + '/vmappedproducts/count', { params: { where: JSON.stringify(q) } })
           .then(handleSuccess);

    }

    function getByCode(code) {
        var q = {
            where: {
                'Code': code
            }
        };

        return $http.get(Urls.BASE_API + '/vmappedproducts', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}