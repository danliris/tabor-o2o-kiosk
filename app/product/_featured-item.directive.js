angular.module('app')
    .directive('featuredItem', featuredItem);

function featuredItem() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '=',
            openDetailItem: '&',
            addOrderItem: '&'
        },
        templateUrl: 'app/product/_featured-item.html'
    }
}