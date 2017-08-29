angular.module('app')
    .controller('ProductController', ProductController);

ProductController.$inject = ['$stateParams', '$sessionStorage', 'HomeService', 'ProductService', 'Order'];
function ProductController($stateParams, $sessionStorage, HomeService, ProductService, Order) {
    var vm = this;

    vm.products = [];
    vm.productQuery = {};

    vm.openDetail = openDetail;
    vm.addOrderItem = addOrderItem;

    vm.searchProducts = searchProducts;
    vm.nextPage = nextPage;

    (function () {
        vm.products = [];
        vm.productQuery = initQuery();

        getProducts(vm.products, vm.productQuery);
    })();

    function openDetail(product) {
        console.log(product);
    }

    function addOrderItem(product) {
        Order.addOrderItem(product);
    }

    function getProducts(products, query) {
        vm.loadingProducts = true;
        return ProductService.getAll(query)
            .then(function (response) {
                for (var i = 0, l = response.length; i < l; i++) {
                    products.push(response[i]);
                }
            })
            .catch(function () {

            })
            .finally(function () {
                vm.loadingProducts = false;
            });
    }

    function initQuery() {
        return {
            keyword: '',
            orderBy: '+Name',
            page: 1,
            limit: 9
        };
    }

    function nextPage(query) {
        query.page++;

        getProducts(vm.products, query);
    }

    function searchProducts(query) {
        query.page = 1;
        vm.products = [];

        getProducts(vm.products, query);
    }
}