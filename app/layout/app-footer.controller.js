angular.module('app')
    .controller('FooterController', FooterController);

FooterController.$inject = [];
function FooterController() {
    var vm = this;
    vm.currentYear = (new Date()).getFullYear();
}