angular.module('app')
    .controller('ProductController', ProductController);

ProductController.$inject = ['$q', '$rootScope', '$stateParams', '$uibModal', 'toastr', 'ProductService', 'Order', 'AuthenticationState'];
function ProductController($q, $rootScope, $stateParams, $uibModal, toastr, ProductService, Order, AuthenticationState) {
    var vm = this;

    vm.currentUser = AuthenticationState.getUser();

    vm.products = [];
    vm.productQuery = {};

    vm.openDetailItem = openDetailItem;
    vm.addOrderItem = addOrderItem;
    vm.nextPage = nextPage;

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

        toastr.success('Item has been added to the shopping bag.', 'Message');
    }

    function getProducts(products, query) {
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

                vm.loadingProducts = false;
            })
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
        vm.productQuery.keyword = $stateParams.keyword;
        vm.productQuery.brandCode = $stateParams.brand;
        vm.productQuery.categoryCode = $stateParams.category;

        getProducts(vm.products, vm.productQuery);
    })();
}