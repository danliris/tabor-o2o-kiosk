angular.module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$state', 'HomeService', 'ProductService', 'AuthenticationState', 'Order', 'toastr', '$uibModal'];
function HomeController($state, HomeService, ProductService, AuthenticationState, Order, toastr, $uibModal) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();

    vm.next = next;
    vm.prev = prev;
    vm.changeSliderType = changeSliderType;
    vm.openDetailItem = openDetailItem;
    vm.addOrderItem = addOrderItem;

    function next(multiplier = 1) {
        scrollFeaturedProducts(true, multiplier);
    }

    function prev(multiplier = 1) {
        scrollFeaturedProducts(false, multiplier);
    }

    function scrollFeaturedProducts(isAdd, multiplier) {
        var value = angular.element('.featured-products').scrollLeft();
        var length = 460 * multiplier;
        if (isAdd)
            value += length;
        else
            value -= length;

        angular.element('.featured-products').animate({ scrollLeft: value }, 300);
    }

    function changeSliderType(type = 'BEST SELLER') {
        vm.sliderType = type;

        if (type == 'BEST SELLER')
            getBestSellerProducts();
        else
            getNewProducts();
    }

    (function () {
        changeSliderType('BEST SELLER');
    })();

    function getBestSellerProducts() {
        vm.isError = false;
        vm.loadingProducts = true;
        ProductService.getAll({
            keyword: '',
            orderBy: '-Sold',
            page: 1,
            limit: 9,
            categoryCode: '*'
        }, vm.currentUser.kiosk.code)
            .then(res => {
                vm.products = res;
            })
            .catch(err => {
                vm.isError = true;
            })
            .finally(() => {
                vm.loadingProducts = false;
            });
    }

    function getNewProducts() {
        vm.isError = false;
        vm.loadingProducts = true;
        ProductService.getAll({
            keyword: '',
            orderBy: '-CreatedDate',
            page: 1,
            limit: 9,
            categoryCode: '*'
        }, vm.currentUser.kiosk.code)
            .then(res => {
                vm.products = res;
            })
            .catch(err => {
                vm.isError = true;
            })
            .finally(() => {
                vm.loadingProducts = false;
            });
    }

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
}