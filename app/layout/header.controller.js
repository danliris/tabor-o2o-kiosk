angular.module('app')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$state', '$stateParams', 'Order', 'BrandService'];
function HeaderController($state, $stateParams, Order, BrandService) {
    var vm = this;
    vm.cartOpen = false;
    vm.totalItemsOnCart = 0;
    vm.searchProduct = searchProduct;
    vm.keyword = $stateParams.keyword;

    vm.removeOrderItem = removeOrderItem;

    (function () {
        getBrands();
        getCategories();

        var currentOrder = Order.getCurrentOrder();
        vm.cartItems = currentOrder.items;
    })();

    function getCategories() {

    }

    function getBrands() {
        BrandService.getAll()
            .then(function (response) {
                vm.brands = response;
            })
            .catch(function () {
            })
            .finally(function () {
            });
    }

    function searchProduct(keyword) {
        if (keyword)
            $state.go('product', { keyword: keyword });
    }

    function removeOrderItem(item) {
        if (confirm('Are you sure want to delete this item?')) {
            Order.removeOrderItem(item);
        }
    }
}