angular.module('app')
    .controller('ProductController', ProductController);

ProductController.$inject = ['$q', '$rootScope', '$state', '$stateParams', '$uibModal', 'toastr', 'ProductService', 'Order', 'AuthenticationState', 'Urls', 'DealerService', 'MessageChannels'];
function ProductController($q, $rootScope, $state, $stateParams, $uibModal, toastr, ProductService, Order, AuthenticationState, Urls, DealerService, MessageChannels) {
    var vm = this;

    vm.currentUser = AuthenticationState.getUser();
    vm.isStaff = AuthenticationState.isStaff();

    vm.products = [];
    vm.productQuery = {};
    vm.$settings = $rootScope.$settings;
    vm.openDetailItem = openDetailItem;
    vm.addOrderItem = addOrderItem;
    vm.nextPage = nextPage;
    vm.getProducts = getProducts;
    vm.openMessenger = openMessenger;
    vm.filterPrice = filterPrice;

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
        return DealerService.getUserIdByDealerCode(product.DealerCode)
            .then(dealerUsers => {
                if (dealerUsers.length == 0) {
                    toastr.error(`There are no users assigned to dealer ${product.DealerCode}`);
                    return;
                }

                MessageChannels.add((new IDGenerator()).generate(), dealerUsers[0].UserId, dealerUsers[0].DealerCode);

                return;
            });
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
            limit: 9,
            priceRange: { min: 0, max: 0, display: 'Semua' }
        };
    }

    function filterPrice(query) {
        query.page = 1;
        vm.products = [];
        getProducts(vm.products, query);
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

    function IDGenerator() {
        this.timestamp = +new Date;

        var _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.generate = function (length = 8) {
            var ts = this.timestamp.toString();
            var parts = ts.split("").reverse();
            var id = "";

            for (var i = 0; i < length; ++i) {
                var index = _getRandomInt(0, parts.length - 1);
                id += parts[index];
            }

            return id;
        }
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

        vm.priceRangeOptions = [
            { min: 0, max: 0, display: 'Semua' },
            { min: 0, max: 2000000, display: '< Rp. 2jt' },
            { min: 2000001, max: 5000000, display: 'Rp. 2jt - Rp. 5jt' },
            { min: 5000001, max: 10000000, display: 'Rp. 5jt - Rp. 10jt' },
            { min: 10000001, max: 0, display: '> Rp. 10jt' }
        ];

        vm.productQuery.priceRange = vm.priceRangeOptions[0];

        getProducts(vm.products, vm.productQuery);
    })();
}