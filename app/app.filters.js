angular.module('app')
    .filter('sum', sum);

function sum() {
    return function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}

angular.module('app')
    .filter('messageTime', messageTime);

messageTime.$inject = ['$filter'];
function messageTime($filter) {
    return function (value) {
        if (!value)
            return 'never';

        value = new Date(value);

        if (value.toDateString() == (new Date()).toDateString())
            return `${$filter('date')(value, 'HH:mm')}`;
        else
            return $filter('date')(value, 'dd MMM yyyy - HH:mm');
        return;
    }
}

angular.module('app')
    .filter('timeDifference', timeDifference);

function timeDifference() {
    return function (time1, time2) {
        if (!time1) return 'never';

        if (!time2)
            time2 = (new Date()).getTime();

        if (angular.isDate(time1))
            time1 = time1.getTime();
        else if (typeof time1 === "string")
            time1 = new Date(time1).getTime();

        if (angular.isDate(time2))
            time2 = time2.getTime();
        else if (typeof time2 === "string")
            time2 = new Date(time2).getTime();

        if (time2 === 'NaN')
            time2 = (new Date()).getTime();

        if (typeof time1 !== 'number' || typeof time2 !== 'number')
            return;

        var offset = (time2 - time1) / 1000,
            MINUTE = 60,
            HOUR = 3600,
            result = [];

        if (isNaN(offset))
            return;

        var minutesLeft = offset % MINUTE;

        var hours = Math.round(Math.abs(offset / HOUR)).toString();
        var minutes = Math.round(Math.abs(minutesLeft / MINUTE)).toString();
        var seconds = Math.round(Math.abs(minutesLeft % MINUTE)).toString();

        result.push(('00' + hours).substring(hours.length));
        result.push(('00' + minutes).substring(minutes.length));
        result.push(('00' + seconds).substring(seconds.length));

        return result.join(':');
    }
}

angular.module('app')
    .filter('isEmpty', function () {
        var bar;
        return function (obj) {
            for (bar in obj) {
                if (obj.hasOwnProperty(bar)) {
                    return false;
                }
            }
            return true;
        };
    });