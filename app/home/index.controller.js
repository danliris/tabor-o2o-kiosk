angular.module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$state', 'HomeService', 'ProductService'];
function HomeController($state, HomeService, ProductService) {
    var vm = this;

    (function () {
        //getBestSellerProducts();
    })();

    function getBestSellerProducts() {
        //ProductService.getAll()
        //    .then(function (response) {
        //        vm.products = response;
        //    });
    }
}