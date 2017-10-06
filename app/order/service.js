angular
    .module('app')
    .service('OrderService', OrderService);

OrderService.$inject = ['$http', 'Urls'];

function OrderService($http, Urls) {
    return {
        getAll: getAll,
        countAll: countAll,
        getAllHistory: getAllHistory,
        countAllHistory: countAllHistory,
        getAllDraft: getAllDraft,
        countAllDraft: countAllDraft,
        getByCode: getByCode,
        getByCodePIN: getByCodePIN,
        createDraft: createDraft,
        updateDraft: updateDraft,
        voidDraft: voidDraft,
        pay: pay,
        updatePaymentStatus: updatePaymentStatus,
        complete: complete,
        arrive: arrive
    };

    function getAll(query, kioskCode) {
        var result = {};
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'Name': {
                    like: '%' + query.keyword + '%'
                },
                'KioskCode': kioskCode
            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAll(query, kioskCode) {
        var q = {
            where: {
                'Name': {
                    like: '%' + query.keyword + '%'
                },
                'KioskCode': kioskCode
            }
        };
        return $http.get(Urls.BASE_API + '/orders/count?' + $.param(q))
            .then(handleSuccess);
    }

    function getAllHistory(query, kioskCode) {
        var result = {};
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'Name': {
                    like: '%' + query.keyword + '%'
                },
                'Status': {
                    nin: ["DRAFTED", "VOIDED"]
                },
                'KioskCode': kioskCode

            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAllHistory(query, kioskCode) {
        var q = {
            where: {
                'Name': {
                    like: '%' + query.keyword + '%'
                },
                'Status': {
                    nin: ["DRAFTED", "VOIDED"]
                },
                'KioskCode': kioskCode
            }
        };
        return $http.get(Urls.BASE_API + '/orders/count?' + $.param(q))
            .then(handleSuccess);
    }

    function getAllDraft(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            include: [

            ],
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                //or: [
                //    { 'Code': { like: '%' + query.keyword + '%' } },
                //    { 'Name': { like: '%' + query.keyword + '%' } },
                //],
                'Name': { like: '%' + query.keyword + '%' },
                'Status': 'DRAFTED',
                'KioskCode': kioskCode
            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }


    function countAllDraft(query, kioskCode) {
        var q = {
            where: {
                //or: [
                //    { 'Code': { like: '%' + query.keyword + '%' } },
                //    { 'Name': { like: '%' + query.keyword + '%' } },
                //],
                'Name': { like: '%' + query.keyword + '%' },
                'Status': 'DRAFTED',
                'KioskCode': kioskCode
            }
        };

        return $http.get(Urls.BASE_API + '/orders/count?' + $.param(q))
            .then(handleSuccess);
    }

    // buat ambil count
    //http://localhost:1337/api/orders/count?where[KioskCode]=JKB001&where[Status]=DRAFTED

    function getByCode(code) {
        var q = {
            include: [
                 {
                     'OrderDetails': ['Product', 'OrderTracks']
                 },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/' + code, { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getByCodeCanBePaid(code) {
        var q = {
            include: [
                 {
                     'OrderDetails': ['Product', 'OrderTracks']
                 },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/' + code, { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getByCodePIN(code, pin) {
        var q = {
            where: {
                'Code': code,
                'PIN': pin
            },
            include: [
                {
                    'OrderDetails': ['Product', 'OrderTracks']
                },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function createDraft(order) {
        return $http.post(Urls.BASE_API + '/orders/draft', { data: order })
		    .then(handleSuccess);
    }

    function updateDraft(order) {
        return $http.put(Urls.BASE_API + '/orders/draft', { data: order })
            .then(handleSuccess);
    }

    function voidDraft(code) {
        return $http.post(Urls.BASE_API + '/orders/void', { code: code })
            .then(handleSuccess);
    }

    function pay(data) {
        return $http.post(Urls.BASE_API + '/orders/payment', { data: data })
            .then(handleSuccess);
    }

    function updatePaymentStatus(code) {
        return $http.post(Urls.BASE_API + '/orders/payment-status', { code: code })
            .then(handleSuccess);
    }

    function complete(code) {
        return $http.post(Urls.BASE_API + '/orders/complete', { code: code })
            .then(handleSuccess);
    }

    function arrive(code) {
        return $http.post(Urls.BASE_API + '/orders/arrive', { code: code })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}