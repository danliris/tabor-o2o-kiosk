angular.module('app')
    .directive('productItemCard', productItemCard);

function productItemCard() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '=',
            openDetailItem: '&',
            addOrderItem: '&'
        },
        templateUrl: 'app/product/item-card.html'
    }
}