angular.module('app')
    .service('DealerService', DealerService);

DealerService.$inject = ['$http', 'Urls'];
function DealerService($http, Urls) {
    return {
        getUserIdByDealerCode: getUserIdByDealerCode
    }

    function getUserIdByDealerCode(dealerCode) {
        var q = {
            where: {
                'DealerCode': dealerCode
            }
        };
        return $http.get(Urls.BASE_API + '/dealerUsers', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}