angular
    .module('app')
    .config(routeConfig);

routeConfig.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider'
];

function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
        // APPLICATION STARTS HERE
        .state('authentication', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/auth-layout.html'
                }
            }
        })
            .state('authentication.login', {
                url: '/login',
                templateUrl: 'app/authentication/login.html',
                data: { pageTitle: 'Login' },
                controller: 'LoginController',
                controllerAs: 'vm'
            })

        // APPLICATION STARTS HERE
        .state('app', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/app-layout.html'
                }
            }
        })

            .state('app.home', {
                url: '/',
                templateUrl: 'app/home/index.html',
                data: { pageTitle: 'Home' },
                controller: 'HomeController',
                controllerAs: 'vm'
            })

            .state('app.product', {
                url: '/search?:keyword&:brand&:category',
                templateUrl: 'app/product/index.html',
                data: { pageTitle: 'Products' },
                controller: 'ProductController',
                controllerAs: 'vm'
            })

            .state('app.checkout', {
                url: '/checkout',
                templateUrl: 'app/order/checkout.html',
                data: { pageTitle: 'Checkout' },
                controller: 'OrderCheckoutController',
                controllerAs: 'vm'
            })

            .state('app.confirm', {
                url: '/confirm',
                templateUrl: 'app/order/confirm.html',
                data: { pageTitle: 'Confirm Order' },
                controller: 'OrderConfirmController',
                controllerAs: 'vm'
            })

            .state('app.confirm-message', {
                url: '/confirm-message/{code}',
                templateUrl: 'app/order/confirm-message.html',
                data: { pageTitle: 'Confirmation Message Order' },
                controller: 'OrderConfirmMessageController',
                controllerAs: 'vm'
            })

            .state('app.order', {
                url: '/order',
                templateUrl: 'app/order/index.html',
                data: { pageTitle: 'Order' },
                controller: 'OrderController',
                controllerAs: 'vm'
            })

                .state('app.order.history', {
                    url: '/history',
                    templateUrl: 'app/order/index.history.html',
                    data: { pageTitle: 'History' },
                    controller: 'OrderHistoryController',
                    controllerAs: 'vm'
                })
                .state('app.order.track', {
                    url: '/track',
                    templateUrl: 'app/order/index.track.html',
                    data: { pageTitle: 'Track' },
                    controller: 'OrderTrackController',
                    controllerAs: 'vm'
                })
                .state('app.order.verify', {
                    url: '/verify',
                    templateUrl: 'app/order/index.verify.html',
                    data: { pageTitle: 'Verify' },
                    controller: 'OrderVerifyController',
                    controllerAs: 'vm'
                })
                .state('app.order.draft', {
                    url: '/draft',
                    templateUrl: 'app/order/index.draft.html',
                    data: { pageTitle: 'Draft' },
                    controller: 'OrderDraftController',
                    controllerAs: 'vm'
                })

                .state('app.order.detail', {
                    url: '/{code}',
                    templateUrl: 'app/order/index.detail.html',
                    data: { pageTitle: 'Order Detail' },
                    controller: 'OrderDetailController',
                    controllerAs: 'vm'
                })

            .state('app.order-payment', {
                url: '/order/{code}/payment',
                templateUrl: 'app/order/payment.html',
                data: { pageTitle: 'Order Payment' },
                controller: 'OrderPaymentController',
                controllerAs: 'vm'
            })

        // APPLICATION STARTS HERE
        .state('blank', {
            abstract: true,
            views: {
                root: {
                    templateUrl: 'app/layout/blank-layout.html'
                }
            }
        })

            .state('blank.invoice', {
                url: '/order/{code}/invoice/{paymentId}',
                templateUrl: 'app/invoice/invoice.html',
                data: { pageTitle: 'Invoice' },
                controller: 'InvoiceController',
                controllerAs: 'vm'
            })

    ;
}