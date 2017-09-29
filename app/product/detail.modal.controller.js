angular.module('app')
    .controller('ProductDetailModalController', ProductDetailModalController);

ProductDetailModalController.$inject = ['code', 'ProductService', '$uibModalInstance', 'toastr'];
function ProductDetailModalController(code, ProductService, $uibModalInstance, toastr) {
    var vm = this;
    vm.product = {};
    vm.close = close;
    vm.addToCart = addToCart;

    function getProduct(code) {
        vm.loadingGetProduct = true;
        ProductService.getByCode(code)
            .then(function (res) {
                vm.product = res[0];
                try {
                    vm.product.ArrayedSpecification = JSON.parse(res[0].Specification);
                } catch (e) {

                }
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetProduct = false;
            });
    }

    function addToCart(product) {
        $uibModalInstance.close(product);
    }

    function close() {
        $uibModalInstance.dismiss('cancel');
    }

    (function () {
        getProduct(code);
    })();
}