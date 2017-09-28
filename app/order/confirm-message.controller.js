angular.module('app')
    .controller('OrderConfirmMessageController', OrderConfirmMessageController);

OrderConfirmMessageController.$inject = ['$stateParams'];

function OrderConfirmMessageController($stateParams) {
    var vm = this;
    
    vm.code = $stateParams.code;
}