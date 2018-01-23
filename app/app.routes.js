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

            .state('app.notification', {
                url: '/notification',
                templateUrl: 'app/notification/index.html',
                data: { pageTitle: 'Notifications' },
                controller: 'NotificationController',
                controllerAs: 'vm'
            })

            .state('app.order', {
                url: '/order',
                templateUrl: 'app/order/index.html',
                data: { pageTitle: 'Order', authorizedRoles: ['staff'] },
                controller: 'OrderController',
                controllerAs: 'vm'
            })

                .state('app.order.history', {
                    url: '/history',
                    templateUrl: 'app/order/index.history.html',
                    data: { pageTitle: 'History', authorizedRoles: ['staff'] },
                    controller: 'OrderHistoryController',
                    controllerAs: 'vm'
                })
                .state('app.order.track', {
                    url: '/track/{code}',
                    templateUrl: 'app/order/index.track.html',
                    data: { pageTitle: 'Track', authorizedRoles: ['staff'] },
                    controller: 'OrderTrackController',
                    controllerAs: 'vm'
                })
                .state('app.order.verify', {
                    url: '/verify',
                    templateUrl: 'app/order/index.verify.html',
                    data: { pageTitle: 'Verify', authorizedRoles: ['staff'] },
                    controller: 'OrderVerifyController',
                    controllerAs: 'vm'
                })
                .state('app.order.draft', {
                    url: '/draft',
                    templateUrl: 'app/order/index.draft.html',
                    data: { pageTitle: 'Draft', authorizedRoles: ['staff'] },
                    controller: 'OrderDraftController',
                    controllerAs: 'vm'
                })
                .state('app.order.checkin', {
                    url: '/check-in',
                    templateUrl: 'app/order/index.checkin.html',
                    data: { pageTitle: 'Check In', authorizedRoles: ['staff'] },
                    controller: 'OrderCheckInController',
                    controllerAs: 'vm'
                })

                .state('app.order.detail', {
                    url: '/{code}',
                    templateUrl: 'app/order/index.detail.html',
                    data: { pageTitle: 'Order Detail', authorizedRoles: ['staff'] },
                    controller: 'OrderDetailController',
                    controllerAs: 'vm'
                })

            .state('app.order-payment', {
                url: '/order/{code}/payment',
                templateUrl: 'app/order/payment.html',
                data: { pageTitle: 'Order Payment', authorizedRoles: ['staff'] },
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
                data: { pageTitle: 'Invoice', authorizedRoles: ['staff'] },
                controller: 'InvoiceController',
                controllerAs: 'vm'
            })

    ;
}