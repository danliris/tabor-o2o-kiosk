angular
    .module('app')
    .config(routeConfig);

routeConfig.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider'
];

function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/home/index.html',
            data: { pageTitle: 'Home' },
            controller: 'HomeController',
            controllerAs: 'vm'
        })

        // /{name}
        // /products
        // /order
        // /cart

        .state('product', {
            url: '/search?:keyword&:brand',
            templateUrl: 'app/product/index.html',
            data: { pageTitle: 'Products' },
            controller: 'ProductController',
            controllerAs: 'vm'
        })

            // .state('product.detail', {
            //     url: '/{slug}',
            //     templateUrl: 'app/product/detail.html',
            //     data: { pageTitle: 'Product' },
            //     controller: 'ProductDetailController',
            //     controllerAs: 'vm'
            // })

        .state('checkout', {
            url: '/checkout',
            templateUrl: 'app/order/checkout.html',
            data: { pageTitle: 'checkout' },
            controller: 'OrderCheckoutController',
            controllerAs: 'vm'
        })
    ;
}