angular
    .module('app')
    .service('NotificationService', NotificationService);

NotificationService.$inject = ['$http', 'Urls'];

function NotificationService($http, Urls) {
    return {
        getAllByUserId: getAllByUserId,
        countAllByUserId: countAllByUserId,
        getAllUnreadByUserId: getAllUnreadByUserId,
        getTotalUnreadNotifications: getTotalUnreadNotifications,
        setRead: setRead
    };

    function getAllByUserId(userId, query) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'UserId': userId
            }
        };

        return $http.get(Urls.BASE_API + '/notifications', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAllByUserId(userId, query) {
        var q = {
            'UserId': userId
        };

        return $http.get(Urls.BASE_API + '/notifications/count', { params: { where: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getAllUnreadByUserId(userId, query) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'IsRead': 0,
                'UserId': userId
            }
        };

        return $http.get(Urls.BASE_API + '/notifications', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getTotalUnreadNotifications(userId) {
        var q = {
            'IsRead': 0,
            'UserId': userId
        };

        return $http.get(Urls.BASE_API + '/notifications/count', { params: { where: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function setRead(notificationId) {
        return $http.patch(Urls.BASE_API + '/notifications/' + notificationId, { IsRead: true })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}