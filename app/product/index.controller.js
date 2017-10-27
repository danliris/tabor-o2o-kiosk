angular.module('app')
    .controller('ProductController', ProductController);

ProductController.$inject = ['$q', '$rootScope', '$state', '$stateParams', '$uibModal', 'toastr', 'ProductService', 'Order', 'AuthenticationState', 'Urls'];
function ProductController($q, $rootScope, $state, $stateParams, $uibModal, toastr, ProductService, Order, AuthenticationState, Urls) {
    var vm = this;

    vm.currentUser = AuthenticationState.getUser();

    vm.products = [];
    vm.productQuery = {};

    vm.openDetailItem = openDetailItem;
    vm.addOrderItem = addOrderItem;
    vm.nextPage = nextPage;
    vm.getProducts = getProducts;
    vm.openMessenger = openMessenger;

    function openDetailItem(product) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/product/detail.modal.html',
            controller: 'ProductDetailModalController',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                code: function () {
                    return product.Code;
                }
            }
        });

        modalInstance.result.then(function (product) {
            addOrderItem(product);
        });
    }

    function addOrderItem(product) {
        Order.addOrderItem({
            code: product.Code,
            sku: product.SKU,
            name: product.Name,
            description: product.Description,
            specification: product.Specification,
            image: product.Image,
            brandCode: product.BrandCode,
            dp: product.DP,
            price: product.Price,
            dealerCode: product.DealerCode
        });

        toastr.success('Item telah ditambahkan ke kerajang belanja.', 'Pesan');
    }

    function openMessenger(product) {
        
    }

    function getProducts(products, query) {
        vm.isError = false;
        vm.loadingProducts = true;
        var promises = [];
        promises.push(
            ProductService.getAll(query, vm.currentUser.kiosk.code)
        );

        promises.push(
            ProductService.countAll(query, vm.currentUser.kiosk.code)
        )

        $q.all(promises)
            .then((responses) => {
                var response = responses[0];

                for (var i = 0, l = response.length; i < l; i++) {
                    try {
                        response[i].ArrayedSpecification = JSON.parse(response[i].Specification);
                    } catch (e) {

                    }

                    products.push(response[i]);
                }

                response = responses[1];
                query.count = response.count;

            })
            .catch(res => {
                vm.isError = true;
            })
            .finally(() => {
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

    (function () {
        vm.products = [];
        vm.productQuery = initQuery();

        if (!$stateParams.keyword
            && !$stateParams.brand
            && !$stateParams.category)
            $state.go('app.home');

        vm.productQuery.keyword = $stateParams.keyword;
        vm.productQuery.brandCode = $stateParams.brand;
        vm.productQuery.categoryCode = $stateParams.category;

        getProducts(vm.products, vm.productQuery);
    })();
}