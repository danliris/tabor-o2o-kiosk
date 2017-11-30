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
                'Name': { like: '%' + (query.keyword || '') + '%' },
                'BrandCode': query.brandCode,
                'ProductCategoryCode': query.categoryCode,
                'KioskCode': kioskCode
            }
        };

        if (query.priceRange.min != 0 || query.priceRange.max != 0) {
            q.where.Price = { between: [query.priceRange.min, query.priceRange.max] };
        }

        if (query.priceRange.min != 0 && query.priceRange.max == 0) {
            q.where.Price = { gt: query.priceRange.min };
        }

        return $http.get(Urls.BASE_API + '/vmappedproducts', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAll(query, kioskCode) {
        var q = {
            and: [
                { 'Name': { like: '%' + (query.keyword || '') + '%' } },
                { 'BrandCode': query.brandCode },
                { 'ProductCategoryCode': query.categoryCode },
                { 'KioskCode': kioskCode }
            ]
        };

        if (query.priceRange.min != 0 || query.priceRange.max != 0)
            q.and.push({ Price: { between: [query.priceRange.min, query.priceRange.max] } });

        if (query.priceRange.min != 0 && query.priceRange.max == 0) {
            q.and.push({ Price: { gt: query.priceRange.min } });
        }


        return $http.get(Urls.BASE_API + '/vmappedproducts/count?where=' + encodeURI(JSON.stringify(q)))
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