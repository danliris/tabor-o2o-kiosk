angular.module('app')
    .directive('productItemCard', productItemCard);

function productItemCard() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '=',
            openDetailItem: '&',
            addOrderItem: '&',
            openMessenger: '&',
            isMessengerReady: '=',
            isStaff: '='
        },
        templateUrl: 'app/product/_item-card.html'
    }
}