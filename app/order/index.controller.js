angular.module('app')
    .controller('OrderController', OrderController);

OrderController.$inject = ['$state'];
function OrderController($state) {
    var vm = this;
}