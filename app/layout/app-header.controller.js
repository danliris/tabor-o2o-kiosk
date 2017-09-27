angular.module('app')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$state', '$stateParams', 'toastr', 'Order', 'BrandService', 'CategoryService', 'AuthenticationService', 'AuthenticationState'];
function HeaderController($state, $stateParams, toastr, Order, BrandService, CategoryService, AuthenticationService, AuthenticationState) {
    var vm = this;
    vm.totalItemsOnCart = 0;
    vm.searchProduct = searchProduct;
    vm.keyword = $stateParams.keyword;

    vm.removeOrderItem = removeOrderItem;
    vm.logout = logout;

    (function () {
        getBrands();
        getCategories();

        var currentOrder = Order.getCurrentOrder();
        vm.cartItems = currentOrder.items;

        vm.authenticatedUser = AuthenticationState.getUser();
    })();

    function getCategories() {
        CategoryService.getByBrandCode('SMSG')
            .then(function (response) {
                vm.categories = response;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
            });
    }

    function getBrands() {
        BrandService.getAll()
            .then(function (response) {
                vm.brands = response;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
            });
    }

    function searchProduct(keyword) {
        if (keyword)
            $state.go('app.product', { keyword: keyword }, { reload: true });
    }

    function removeOrderItem(item) {
        if (confirm('Are you sure want to delete this item?')) {
            Order.removeOrderItem(item);
            toastr.warning('Item has been removed from the shopping bag.', 'Message');
        }
    }

    function logout() {
        AuthenticationService.signOut()
        AuthenticationState.remove();
        Order.initiateOrder();

        $state.go('authentication.login');
    }
}