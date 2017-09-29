angular.module('app')
    .filter('sum', sum);

function sum() {
    return function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}