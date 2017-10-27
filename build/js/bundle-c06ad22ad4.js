angular.module('app', [
    'ui.router',
    'ui.bootstrap',
    //'ngSanitize',
    'ngStorage',
    'fcsa-number',
    //'ngAnimate',
    'toastr',
    'ngTouch',

    'app.authentication' // bukan library
]);

angular.module('app')
    .factory('httpInterceptor', httpInterceptor);

httpInterceptor.$inject = [
    '$q',
    '$rootScope',
    '$localStorage'
];

function httpInterceptor($q, $rootScope, $localStorage) {
    return {
        request: function (config) {
            // !@#$##@#$
            // config.params = config.params || {};
            // if ($localStorage.token) {
            //     config.params.access_token = $localStorage.token;
            // }

            return config;
        },

        responseError: function (rejection) {
            //if (rejection.data.error === 'token_not_provided' || rejection.data.error === 'token_expired') {
            //    $location.path('/login');
            //}
            console.log(rejection);

            if (rejection.data) {
                if (rejection.data.error) {
                    return $q.reject(rejection.data.error.statusCode + ' - ' + rejection.data.error.message);
                }
            }

            return $q.reject(rejection.status + ' - ' + rejection.statusText);
        }
    };
}

angular
    .module('app')
    .config(['$localStorageProvider', function ($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('jet-o2o-');
    }]);

angular
    .module('app')
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);

angular
    .module('app')
    .config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);

angular
    .module('app')
    .factory('settings', settings);

settings.$inject = [
    '$rootScope'
];

function settings($rootScope) {
    var settings = {
        pageTitle: 'O2O',
        // cartOpen: false,
        // notificationOpen: false,
        // toggleCartOpen: toggleCartOpen,
        // toggleNotificationOpen: toggleNotificationOpen
    };

    // function toggleCartOpen() {
    //     this.cartOpen = !this.cartOpen;
    //     this.notificationOpen = false;
    // }

    // function toggleNotificationOpen() {
    //     this.notificationOpen = !this.notificationOpen;
    //     this.cartOpen = false;
    // }

    return settings;
}

angular
    .module('app')
    .run(runBlock);

runBlock.$inject = [
    '$rootScope',
    '$state',
    '$transitions',
    'settings',
    'AuthenticationState'
];

function runBlock($rootScope, $state, $transitions, settings, AuthenticationState) {
    $rootScope.$settings = settings;

    $transitions.onStart({}, function (trans) {
        if (!AuthenticationState.isLoggedIn()) {
            $state.go('authentication.login');
        }

        // check authorized user
        var stateData = trans.$to().data;
        if (stateData.authorizedRoles) {
            var currentUser = AuthenticationState.getUser();
            var authorized = false;
            for (var i = 0, length = stateData.authorizedRoles.length; i < length; i++) {
                authorized = authorized || (currentUser.roles.find(x => x.name == stateData.authorizedRoles[i]) ? true : false);
            }
            if (!authorized) {
                $state.go('app.home');
            }
        }

        $rootScope.$settings.pageTitle = stateData.pageTitle;
        $rootScope.$settings.cartOpen = false;
    });
}
angular
	.module('app')
	.constant('Urls', {
	    // BASE_API: 'http://localhost:1337/api', // DEVELOPMENT
	    BASE_API: 'http://tabor-o2o-webapi-internal-dev.azurewebsites.net/api', // UAT
	    // BASE_API: 'http://11.11.1.42:10010/api', // THEATRE
	});

angular.module('app')
    .filter('sum', sum);

function sum() {
    return function (items, prop) {
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }
}


angular
    .module('app')
    .filter('timeDifference', function () {
        return function (time1, time2) {
            if (!time1) return 'never';

            if (!time2)
                time2 = (new Date()).getTime();

            if (angular.isDate(time1))
                time1 = time1.getTime();
            else if (typeof time1 === "string")
                time1 = new Date(time1).getTime();

            if (angular.isDate(time2))
                time2 = time2.getTime();
            else if (typeof time2 === "string")
                time2 = new Date(time2).getTime();

            if (time2 === 'NaN')
                time2 = (new Date()).getTime();

            if (typeof time1 !== 'number' || typeof time2 !== 'number')
                return;

            var offset = (time2 - time1) / 1000,
                MINUTE = 60,
                HOUR = 3600,
                result = [];

            if (isNaN(offset))
                return;

            var minutesLeft = offset % MINUTE;

            var hours = Math.round(Math.abs(offset / HOUR)).toString();
            var minutes = Math.round(Math.abs(minutesLeft / MINUTE)).toString();
            var seconds = Math.round(Math.abs(minutesLeft % MINUTE)).toString();

            result.push(('00' + hours).substring(hours.length));
            result.push(('00' + minutes).substring(minutes.length));
            result.push(('00' + seconds).substring(seconds.length));

            return result.join(':');
        }
    })


angular
    .module('app')
    .directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, element, attributes) {
                if (attributes.ngClick || attributes.href === '' || attributes.href === '#') {
                    element.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        }
    });
angular
    .module('app')
    .directive('backButton', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    $window.history.back();
                });
            }
        };
    }]);

angular
    .module('app')
    .directive('ngSpinnerBar', ['$rootScope', '$transitions', function ($rootScope, $transitions) {
        return {
            link: function (scope, element, attributes) {
                // by default hide the spinner bar
                element.addClass('hide');

                $transitions.onStart({}, function () {
                    element.removeClass('hide');
                });

                $transitions.onSuccess({}, function () {
                    element.addClass('hide');
                });

                //$transitions.$on('$stateChangeStart', function () {
                //    element.removeClass('hide');
                //    console.log('on state change start');
                //});

                //// hide the spinner bar on rounte change success(after the content loaded)
                //$transitions.$on('$stateChangeSuccess', function () {
                //    element.addClass('hide'); // hide spinner bar
                //    //$('body').removeClass('page-on-load'); // remove page loading indicator
                //    //Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                //    console.log('on state change success');

                //    // auto scorll to page top
                //    // setTimeout(function () {
                //    //     App.scrollTop(); // scroll to the top on content load
                //    // }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                //});

                //// handle errors
                //$transitions.$on('$stateNotFound', function () {
                //    console.log('on state change not found');

                //    element.addClass('hide'); // hide spinner bar
                //});

                //// handle errors
                //$transitions.$on('$stateChangeError', function () {
                //    console.log('on state change error');

                //    element.addClass('hide'); // hide spinner bar
                //});

            }
        }
    }]);
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
angular.module('app.authentication', []);
angular.module('app.authentication').service('AuthenticationService', AuthenticationService);

AuthenticationService.$inject = [
    '$http',
    'Urls'
];
function AuthenticationService($http, Urls) {
    var currentUser;

    return {
        signIn: signIn,
        signOut: signOut,
        getAuthenticatedUser: getAuthenticatedUser,
        getKioskUser: getKioskUser,
        getRoleUser: getRoleUser
    };

    function signIn(user) {
        return $http.post(Urls.BASE_API + '/users/login', user)
            .then(handleSuccess);
    }

    function signOut() {
        return $http.post(Urls.BASE_API + '/users/logout')
            .then(handleSuccess);
    }

    function getAuthenticatedUser(id) {
        return $http.get(Urls.BASE_API + '/users/' + id)
            .then(handleSuccess);
    }

    function getKioskUser(id) {
        var q = {
            filter: {
                where: {
                    'UserId': id
                },
                include: [
                    'Kiosk'
                ]
            }
        }

        return $http.get(Urls.BASE_API + '/kioskusers?' + $.param(q))
            .then(handleSuccess);
    }

    function getRoleUser(id) {
        var q = {
            filter: {
                where: {
                    principalType: 'USER',
                    principalId: id
                },
                include: {
                    relation: 'role'
                }
            }
        }

        return $http.get(Urls.BASE_API + '/rolemappings?' + $.param(q))
            .then(handleSuccess);
    }

    function handleSuccess(res) {
        return res.data;
    }

}
angular
    .module('app')
    .service('BrandService', BrandService);

BrandService.$inject = ['$http', 'Urls'];

function BrandService($http, Urls) {
    return {
        getAll: getAll
    };

    function getAll() {
        return $http.get(Urls.BASE_API + '/brands')
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}
angular
    .module('app')
    .service('CategoryService', CategoryService);

CategoryService.$inject = ['$http', 'Urls'];

function CategoryService($http, Urls) {
    return {
        getByBrandCode: getByBrandCode
    };

    function getByBrandCode(brandCode) {
        var q = {
            where: {
                'BrandCode': brandCode
            }
        };

        return $http.get(Urls.BASE_API + '/productcategories', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}
angular.module('app')
    .service('HomeService', HomeService);

HomeService.$inject = ['$http'];
function HomeService() {
}
angular
    .module('app')
    .service('NotificationService', NotificationService);

NotificationService.$inject = ['$http', 'Urls'];

function NotificationService($http, Urls) {
    return {
        getAllByUserId: getAllByUserId,
        countAllByUserId: countAllByUserId,
        getAllUnreadByUserId: getAllUnreadByUserId,
        getTotalUnreadNotifications: getTotalUnreadNotifications,
        setRead: setRead
    };

    function getAllByUserId(userId, query) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'UserId': userId
            }
        };

        return $http.get(Urls.BASE_API + '/notifications', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAllByUserId(userId, query) {
        var q = {
            'UserId': userId
        };

        return $http.get(Urls.BASE_API + '/notifications/count', { params: { where: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getAllUnreadByUserId(userId, query) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'IsRead': 0,
                'UserId': userId
            }
        };

        return $http.get(Urls.BASE_API + '/notifications', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getTotalUnreadNotifications(userId) {
        var q = {
            'IsRead': 0,
            'UserId': userId
        };

        return $http.get(Urls.BASE_API + '/notifications/count', { params: { where: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function setRead(notificationId) {
        return $http.patch(Urls.BASE_API + '/notifications/' + notificationId, { IsRead: true })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}
angular
    .module('app')
    .service('OrderService', OrderService);

OrderService.$inject = ['$http', 'Urls'];

function OrderService($http, Urls) {
    return {
        getAll: getAll,
        countAll: countAll,
        getAllHistory: getAllHistory,
        countAllHistory: countAllHistory,
        getAllDraft: getAllDraft,
        countAllDraft: countAllDraft,
        getByCode: getByCode,
        getByCodePIN: getByCodePIN,
        createDraft: createDraft,
        updateDraft: updateDraft,
        voidDraft: voidDraft,
        pay: pay,
        updatePaymentStatus: updatePaymentStatus,
        complete: complete,
        arrive: arrive,
        detailArrive: detailArrive
    };

    function getAll(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                and: [
                    {
                        or: [
                            { 'Code': { like: '%' + query.keyword + '%' } },
                            { 'Name': { like: '%' + query.keyword + '%' } },
                        ]
                    },
                    { 'KioskCode': kioskCode }
                ]
            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAll(query, kioskCode) {
        var q = {
            and: [
                {
                    or: [
                        { 'Code': { like: '%' + query.keyword + '%' } },
                        { 'Name': { like: '%' + query.keyword + '%' } },
                    ]
                },
                { 'KioskCode': kioskCode }
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/count?where=' + encodeURI(JSON.stringify(q)))
            .then(handleSuccess);
    }

    function getAllHistory(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                and: [
                    {
                        or: [
                            { 'Code': { like: '%' + query.keyword + '%' } },
                            { 'Name': { like: '%' + query.keyword + '%' } },
                        ]
                    },
                    {
                        'Status': {
                            nin: ["DRAFTED", "VOIDED"]
                        }
                    },
                    {
                        'KioskCode': kioskCode
                    }
                ]
            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAllHistory(query, kioskCode) {
        var q = {
            and: [
                {
                    or: [
                        { 'Code': { like: '%' + query.keyword + '%' } },
                        { 'Name': { like: '%' + query.keyword + '%' } },
                    ]
                },
                {
                    'Status': {
                        nin: ["DRAFTED", "VOIDED"]
                    }
                },
                {
                    'KioskCode': kioskCode
                }
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/count?where=' + encodeURI(JSON.stringify(q)))
            .then(handleSuccess);
    }

    function getAllDraft(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            include: [

            ],
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                and: [
                    {
                        or: [
                            { 'Code': { like: '%' + query.keyword + '%' } },
                            { 'Name': { like: '%' + query.keyword + '%' } },
                        ]
                    },
                    { 'Status': 'DRAFTED' },
                    { 'KioskCode': kioskCode }
                ]

            }
        };

        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }


    function countAllDraft(query, kioskCode) {
        var q = {
            and: [
                {
                    or: [
                        { 'Code': { like: '%' + query.keyword + '%' } },
                        { 'Name': { like: '%' + query.keyword + '%' } },
                    ]
                },
                { 'Status': 'DRAFTED' },
                { 'KioskCode': kioskCode }
            ]
        };

        return $http.get(Urls.BASE_API + '/orders/count?where=' + encodeURI(JSON.stringify(q)))
            .then(handleSuccess);

    }

    // buat ambil count
    //http://localhost:1337/api/orders/count?where[KioskCode]=JKB001&where[Status]=DRAFTED

    function getByCode(code) {
        var q = {
            include: [
                {
                    'OrderDetails': ['Product', 'OrderTracks']
                },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/' + code, { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getByCodeCanBePaid(code) {
        var q = {
            include: [
                {
                    'OrderDetails': ['Product', 'OrderTracks']
                },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders/' + code, { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function getByCodePIN(code, pin) {
        var q = {
            where: {
                'Code': code,
                'PIN': pin
            },
            include: [
                {
                    'OrderDetails': ['Product', 'OrderTracks']
                },
                'OrderPayments'
            ]
        };
        return $http.get(Urls.BASE_API + '/orders', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function createDraft(order) {
        return $http.post(Urls.BASE_API + '/orders/draft', { data: order })
            .then(handleSuccess);
    }

    function updateDraft(order) {
        return $http.put(Urls.BASE_API + '/orders/draft', { data: order })
            .then(handleSuccess);
    }

    function voidDraft(code) {
        return $http.post(Urls.BASE_API + '/orders/void', { code: code })
            .then(handleSuccess);
    }

    function pay(data) {
        return $http.post(Urls.BASE_API + '/orders/payment', { data: data })
            .then(handleSuccess);
    }

    function updatePaymentStatus(code) {
        return $http.post(Urls.BASE_API + '/orders/payment-status', { code: code })
            .then(handleSuccess);
    }

    function complete(code) {
        return $http.post(Urls.BASE_API + '/orders/complete', { code: code })
            .then(handleSuccess);
    }

    function arrive(code) {
        return $http.post(Urls.BASE_API + '/orders/arrive', { code: code })
            .then(handleSuccess);
    }

    function detailArrive(code, detailCode) {
        return $http.post(`${Urls.BASE_API}/orders/${code}/orderdetails/${detailCode}/arrive`)
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}
angular
    .module('app')
    .service('ProductService', ProductService);

ProductService.$inject = ['$http', 'Urls'];

function ProductService($http, Urls) {
    return {
        getAll: getAll,
        getByCode: getByCode,
        countAll: countAll,
    };

    function getAll(query, kioskCode) {
        var asc = query.orderBy.indexOf('+') > -1;
        var orderByColumn = query.orderBy.substring(1);

        var q = {
            order: orderByColumn + (asc ? ' ASC' : ' DESC'),
            limit: query.limit,
            skip: (query.page - 1) * query.limit,
            where: {
                'Name': {
                    like: '%' + (query.keyword || '') + '%'
                },
                'BrandCode': query.brandCode,
                'ProductCategoryCode': query.categoryCode,
                'KioskCode': kioskCode,
            }
        };

        return $http.get(Urls.BASE_API + '/vmappedproducts', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function countAll(query, kioskCode) {
        var q = {
            and: [
                { 'Name': { like: '%' + (query.keyword || '') + '%' } },
                { 'BrandCode': query.brandCode },
                { 'ProductCategoryCode': query.categoryCode },
                { 'KioskCode': kioskCode }
            ]
        };


        return $http.get(Urls.BASE_API + '/vmappedproducts/count?where=' + encodeURI(JSON.stringify(q)))
            .then(handleSuccess);

    }

    function getByCode(code) {
        var q = {
            where: {
                'Code': code
            }
        };

        return $http.get(Urls.BASE_API + '/vmappedproducts', { params: { filter: JSON.stringify(q) } })
            .then(handleSuccess);
    }

    function handleSuccess(response) {
        return response.data;
    }
}
angular.module('app')
    .service('ShippingService', ShippingService);

ShippingService.$inject = ['$http', 'Urls'];
function ShippingService($http, Urls) {
    return {
        getPricings: getPricings,
        getLocations: getLocations,
        getWeightRoundingLimit: getWeightRoundingLimit
    };

    function getPricings(origin, destination, weight) {
        var data = {
            origin: origin,
            destination: destination,
            weight: weight
        };
        return $http.post(Urls.BASE_API + '/orders/shipping/pricings', data)
            .then(handleSuccess);
    }

    function getLocations(keyword) {
        return $http.get(Urls.BASE_API + '/orders/shipping/locations', { params: { keyword: keyword } })
            .then(handleSuccess);
    }

    function getWeightRoundingLimit() {
        return $http.get(Urls.BASE_API + '/orders/shipping/weightroundinglimit')
            .then(handleSuccess);
    }

    function handleSuccess(res) {
        return res.data;
    }
}
angular.module('app.authentication').factory('AuthenticationState', AuthenticationState);
AuthenticationState.$inject = [
    '$http',
    '$localStorage'
];
function AuthenticationState($http, $localStorage) {
    return {
        setToken: setToken,
        getToken: getToken,
        setUser: setUser,
        getUser: getUser,
        isLoggedIn: isLoggedIn,
        remove: remove,
        isGuest: isGuest,
        isStaff: isStaff
    }

    function setToken(token) {
        $localStorage.token = token.id;
        $localStorage.tokenExpiredAt = new Date(new Date(token.created) + token.ttl);
        $http.defaults.headers.common.Authorization = token.id;
    }

    function getToken() {
        return $localStorage.token;
    }

    function isLoggedIn() {
        return $localStorage.user ? true : false;
    }

    function remove() {
        $localStorage.$reset();
        delete $http.defaults.headers.common.Authorization;
    }

    function setUser(user) {
        $localStorage.user = user;
    }

    function getUser() {
        return $localStorage.user;
    }

    function isGuest() {
        if ($localStorage.user.roles)
            return $localStorage.user.roles.find(x => x.name == 'guest') ? true : false;

        return false;
    }

    function isStaff() {
        if ($localStorage.user.roles)
            return $localStorage.user.roles.find(x => x.name == 'staff') ? true : false;

        return false;

    }
}
angular.module('app')
    .factory('Order', Order);

Order.$inject = [
    '$sessionStorage',
    '$filter'
];

function Order($sessionStorage, $filter) {
    return {
        getCurrentOrder: getCurrentOrder,
        addOrderItem: addOrderItem,
        removeOrderItem: removeOrderItem,
        initiateOrder: initiateOrder
    }

    function getCurrentOrder() {
        if (!$sessionStorage.order) {
            initiateOrder();
        }

        return $sessionStorage.order;
    }

    function addOrderItem(item) {
        if (!$sessionStorage.order) {
            initiateOrder();
        }

        var existingData = $filter('filter')($sessionStorage.order.items, { 'sku': item.sku })[0];

        if (existingData) {
            existingData.quantity++;
        }
        else {
            item.quantity = 1;
            $sessionStorage.order.items.push(item);
        }
    }

    function removeOrderItem(item) {
        var index = $sessionStorage.order.items.indexOf(item);
        $sessionStorage.order.items.splice(index, 1);
    }

    function initiateOrder() {
        $sessionStorage.order = {};
        $sessionStorage.order.items = [];
    }
}
angular.module('app').filter('totalPrice', totalPrice);
angular.module('app').filter('dpNominal', dpNominal);
angular.module('app').filter('totalDPNominal', totalDPNominal);
angular.module('app').filter('humanify', humanify);

function totalPrice() {
    return function (items) {
        return items.reduce(function (a, b) {
            return a + (b.quantity * b.price);
        }, 0);
    }
}

function totalDPNominal() {
    return function (items) {
        return items.reduce(function (a, b) {
            return a + (b.quantity * (b.dp / 100 * b.price));
        }, 0);
    }
}

function dpNominal() {
    return function (item) {
        return item.quantity * (item.dp / 100 * item.price);
    }
}

function humanify() {
    return function (status) {
        if (status == 'DRAFTED')
            return 'Pesanan dibuat oleh pembeli';
        else if (status == 'REQUESTED')
            return 'Pesanan telah dikirim ke Dealer';
        else if (status == 'SUBMITTED')
            return 'Sudah diterima oleh Dealer';
        else if (status == 'REJECTED')
            return 'Dibatalkan oleh Dealer';
        else if (status == 'DELIVERED')
            return 'Pesanan sedang diantar.';
        else if (status == 'ARRIVED')
            return 'Pesanan sudah sampai di Outlet';
        else if (status == 'COMPLETED')
            return 'Pesanan sudah diterima oleh Customer';
        else if (status == 'VOIDED')
            return 'Pesanan dibatalkan oleh pembeli';
        else
            return status;
    }
}
'use strict';

angular.module('app.authentication')
    .controller('LoginController', LoginController);

LoginController.$inject = ['AuthenticationService', 'AuthenticationState', '$q', '$state'];

function LoginController(AuthenticationService, AuthenticationState, $q, $state) {
    var vm = this;

    vm.user = {
        email: '',
        password: ''
    };

    vm.login = login;

    function login(user) {
        vm.loading = true;
        vm.message = '';
        var authenticatedUser = {};

        AuthenticationService.signIn(user)
            .then(function (res) {
                AuthenticationState.setToken(res);

                var promises = [];
                promises.push(AuthenticationService.getAuthenticatedUser(res.userId));
                promises.push(AuthenticationService.getKioskUser(res.userId));
                promises.push(AuthenticationService.getRoleUser(res.userId));

                return $q.all(promises);
            })
            .then(function (responses) {
                // hasil dari get authenticated user
                var response = responses[0];
                authenticatedUser.id = response.id;
                authenticatedUser.email = response.email;
                authenticatedUser.username = response.username;

                // hasil dari kiosk user
                response = responses[1];
                if (response.length == 0) {
                    throw 'User ini tidak berada di kiosk manapun.';
                }

                var kiosk = response[0].Kiosk;
                authenticatedUser.kiosk = {
                    code: kiosk.Code,
                    name: kiosk.Name,
                    address: kiosk.Address,
                    phone: kiosk.PhoneNumber,
                    branchCode: kiosk.BranchCode,
                    branchName: kiosk.BranchName,
                };

                // get user role
                response = responses[2];
                if (response.length == 0) {
                    throw 'Unauthorized';
                }
                authenticatedUser.roles = [];
                for (var i = 0, length = response.length; i < length; i++) {
                    authenticatedUser.roles.push(response[i].role);
                }

                AuthenticationState.setUser(authenticatedUser);

                $state.go('app.home');
            })
            .catch(function (err) {
                vm.message = err;
                AuthenticationState.remove();
            })
            .finally(function () {
                vm.loading = false;
            });
    }
}
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
angular.module('app')
    .directive('imageApi', imageApi);

imageApi.$inject = ['Urls'];

function imageApi(Urls) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            src: '=',
            name: '='
        },
        link: function (scope) {
            scope.src = `${Urls.BASE_API}/${scope.src}`;
        },
        templateUrl: 'app/components/image-api.html'
    };
}

angular.module('app')
    .directive('loadingIndicator', loadingIndicator);

function loadingIndicator() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/components/loading-indicator.html'
    };
}

angular.module('app')
    .directive('noData', noData);

function noData() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
        },
        templateUrl: 'app/components/no-data.html'
    };
}

angular.module('app')
    .directive('reloadIndicator', reloadIndicator);

function reloadIndicator() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            action: '&'
        },
        templateUrl: 'app/components/reload-indicator.html'
    };
}

angular.module('app')
    .controller('FooterController', FooterController);

FooterController.$inject = [];
function FooterController() {
    var vm = this;
    vm.currentYear = (new Date()).getFullYear();
}
angular.module('app')
    .controller('HeaderController', HeaderController);

HeaderController.$inject = ['$state', '$stateParams', '$timeout', '$q', 'toastr', 'Order', 'BrandService', 'CategoryService', 'AuthenticationService', 'AuthenticationState', 'NotificationService'];
function HeaderController($state, $stateParams, $timeout, $q, toastr, Order, BrandService, CategoryService, AuthenticationService, AuthenticationState, NotificationService) {
    var vm = this;

    var refreshTime = 600;
    vm.ticks = refreshTime;
    vm.totalItemsOnCart = 0;
    vm.searchProduct = searchProduct;
    vm.keyword = $stateParams.keyword;

    vm.removeOrderItem = removeOrderItem;
    vm.logout = logout;
    vm.trackOrder = trackOrder;

    (function () {
        //getBrands();
        getCategories();

        var currentOrder = Order.getCurrentOrder();
        vm.cartItems = currentOrder.items;

        vm.authenticatedUser = AuthenticationState.getUser();

        vm.isStaff = AuthenticationState.isStaff();

        vm.notifications = [];

        getNotifications();

        ticking();
    })();

    function ticking() {

        vm.ticks--;
        if (vm.ticks == 0) {
            getNotifications();
            vm.ticks = refreshTime;
        }

        $timeout(ticking, 1000);
    }

    function getNotifications() {
        var promises = [];
        promises.push(getUnreadNotifications(initNotificationQuery()));
        promises.push(getTotalUnreadNotifications());

        vm.loadingGetUnreadNotifications = true;
        $q.all(promises)
            .then(responses => {
                var response = responses[0];
                vm.notifications = response;

                response = responses[1];
                vm.totalUnreadNotifications = response.count;
            })
            .catch(err => { })
            .finally(() => {
                vm.loadingGetUnreadNotifications = false;
            });
    }

    function getCategories() {
        CategoryService.getByBrandCode('SMSG')
            .then(function (response) {
                vm.categories = response;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
            });
    }

    //function getBrands() {
    //    BrandService.getAll()
    //        .then(function (response) {
    //            vm.brands = response;
    //        })
    //        .catch(function (err) {
    //            toastr.error(err);
    //        })
    //        .finally(function () {
    //        });
    //}

    function searchProduct(keyword) {
        if (keyword)
            $state.go('app.product', { keyword: keyword, brand: '', category: '*' });
    }

    function removeOrderItem(item) {
        if (confirm('Apakah anda yakin untuk membatalkan transaksi item ini?')) {
            Order.removeOrderItem(item);
            toastr.warning('Item telah dihapus dari transaksi ini', 'Pesan');
        }
    }

    function getUnreadNotifications(query) {
        return NotificationService.getAllUnreadByUserId(vm.authenticatedUser.id, query);
    }

    function getTotalUnreadNotifications() {
        return NotificationService.getTotalUnreadNotifications(vm.authenticatedUser.id)
    }

    function logout() {
        return AuthenticationService.signOut()
            .then(() => {
                AuthenticationState.remove();
                Order.initiateOrder();
                $state.go('authentication.login');
            });

    }

    function initNotificationQuery() {
        return {
            keyword: '',
            orderBy: '-NotifiedDate',
            page: 1,
            limit: 9
        };
    }

    function trackOrder(notification) {
        // kalo udah pernah, ga usah patch data lagi
        if (notification.IsRead) {
            var data = JSON.parse(notification.Data);
            $state.go('app.order.track', { code: data.orderCode });
            return;
        }

        if (notification.loading)
            return;

        notification.loading = true;

        NotificationService.setRead(notification.id)
            .then(res => {
                var data = JSON.parse(notification.Data);
                $state.go('app.order.track', { code: data.orderCode }, { reload: true });
                return;
            })
            .catch(err => { })
            .finally(() => {
                notification.loading = false;
            });
    }
}


angular.module('app')
    .controller('InvoiceController', InvoiceController);

InvoiceController.$inject = ['$stateParams', '$filter', '$timeout', '$window', 'OrderService', 'AuthenticationState'];
function InvoiceController($stateParams, $filter, $timeout, $window, OrderService, AuthenticationState) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.order = {};
    vm.orderPayment = {};
    vm.print = print;
    vm.close = close;

    (function () {
        getOrderByCode($stateParams.code);
    })();

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                vm.order = res;
                var orderPayments = $filter('filter')(res.OrderPayments, { id: $stateParams.paymentId });
                if (orderPayments.length == 0) {
                    $window.close();
                }

                vm.orderPayment = orderPayments[0];

                //vm.order.fullPayment = vm.orderPayment.Amount == vm.order.TotalPrice

            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function print() {
        $window.print();
    }

    function close() {
        $window.close();
    }
}
angular.module('app')
    .directive('invoiceDownPayment', invoiceDownPayment);

function invoiceDownPayment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/_down-payment.html'
    }
}
angular.module('app')
    .directive('invoiceFulfillment', invoiceFulfillment);

function invoiceFulfillment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/_fulfillment.html'
    }
}
angular.module('app')
    .directive('invoiceFullPayment', invoiceFullPayment);

function invoiceFullPayment() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=',
            orderPayment: '='
        },
        templateUrl: 'app/invoice/_full-payment.html'
    }
}
angular.module('app')
    .controller('NotificationController', NotificationController);

NotificationController.$inject = ['$state', '$q', 'AuthenticationState', 'NotificationService'];
function NotificationController($state, $q, AuthenticationState, NotificationService) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.getNotifications = getNotifications;
    vm.next = next;
    vm.trackOrder = trackOrder;

    (function () {
        vm.query = initQuery();
        getNotifications(vm.query);
    })();

    function initQuery() {
        return {
            keyword: '',
            orderBy: '-NotifiedDate',
            page: 1,
            limit: 25
        };
    }

    function getNotifications(query) {
        vm.isError = false;
        vm.loadingGetNotifications = true;
        vm.notifications = vm.notifications || [];

        var promises = [];
        promises.push(
            NotificationService.getAllByUserId(vm.currentUser.id, query)
        );

        promises.push(
            NotificationService.countAllByUserId(vm.currentUser.id, query)
        );

        $q.all(promises)
            .then(responses => {
                var notifications = responses[0];
                notifications.forEach(notification => {
                    vm.notifications.push(notification);
                });

                var response = responses[1];
                query.count = response.count;
            })
            .catch(err => { vm.isError = true })
            .finally(() => {
                vm.loadingGetNotifications = false;
            });
    }

    function next() {
        vm.query.page++;
        getNotifications(vm.query);
    }

    function trackOrder(notification) {
        // kalo udah pernah, ga usah patch data lagi
        if (notification.IsRead) {
            var data = JSON.parse(notification.Data);
            $state.go('app.order.track', { code: data.orderCode });
            return;
        }

        if (notification.loading)
            return;

        notification.loading = true;

        NotificationService.setRead(notification.id)
            .then(res => {
                var data = JSON.parse(notification.Data);
                $state.go('app.order.track', { code: data.orderCode }, { reload: true });
                return;
            })
            .catch(err => { })
            .finally(() => {
                notification.loading = false;
            });
    }
}
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
angular.module('app')
    .controller('ProductController', ProductController);

ProductController.$inject = ['$q', '$rootScope', '$state', '$stateParams', '$uibModal', 'toastr', 'ProductService', 'Order', 'AuthenticationState', 'Urls'];
function ProductController($q, $rootScope, $state, $stateParams, $uibModal, toastr, ProductService, Order, AuthenticationState, Urls) {
    var vm = this;

    vm.currentUser = AuthenticationState.getUser();

    vm.products = [];
    vm.productQuery = {};

    vm.openDetailItem = openDetailItem;
    vm.addOrderItem = addOrderItem;
    vm.nextPage = nextPage;
    vm.getProducts = getProducts;

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
            limit: 9
        };
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

        getProducts(vm.products, vm.productQuery);
    })();
}
angular.module('app')
    .directive('featuredItem', featuredItem);

function featuredItem() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '=',
            openDetailItem: '&',
            addOrderItem: '&'
        },
        templateUrl: 'app/product/_featured-item.html'
    }
}
angular.module('app')
    .directive('productItemCard', productItemCard);

function productItemCard() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            product: '=',
            openDetailItem: '&',
            addOrderItem: '&'
        },
        templateUrl: 'app/product/_item-card.html'
    }
}
angular.module('app')
    .controller('OrderCheckoutController', OrderCheckoutController);

OrderCheckoutController.$inject = ['$state', '$window', 'toastr', 'Order', 'AuthenticationState'];
function OrderCheckoutController($state, $window, toastr, Order, AuthenticationState) {
    var vm = this;

    vm.order = {};
    vm.shippingAddress = {};

    vm.removeOrderItem = removeOrderItem;
    vm.updateAddress = updateAddress;
    vm.toggleToKiosk = toggleToKiosk;
    vm.currentUser = AuthenticationState.getUser();

    (function () {
        vm.order = Order.getCurrentOrder();

        if (vm.order.items.length == 0) {
            toastr.warning('Keranjang belanja Anda kosong.');
            $state.go('app.home');
        }

        vm.order.toKiosk = (vm.order.toKiosk == undefined) ? true : vm.order.toKiosk;

        vm.shippingAddress = {
            name: vm.order.name,
            phone: vm.order.phone,
            email: vm.order.email,
            address: vm.order.address,
            idCard: vm.order.idCard,
            toKiosk: vm.order.toKiosk
        };

        toggleToKiosk(vm.order.toKiosk);

    })();

    function removeOrderItem(item) {
        if (confirm('Apakah anda yakin untuk membatalkan transaksi item ini?')) {
            Order.removeOrderItem(item);
            toastr.warning('Item telah dihapus dari transaksi ini', 'Pesan');
        }
    }

    function updateAddress(shippingAddress) {
        vm.order.name = shippingAddress.name;
        vm.order.phone = shippingAddress.phone;
        vm.order.email = shippingAddress.email;
        vm.order.address = shippingAddress.address;
        vm.order.idCard = shippingAddress.idCard;
        vm.order.toKiosk = shippingAddress.toKiosk;
        vm.order.kioskCode = vm.currentUser.kiosk.code;

        $state.go('app.confirm');

    }

    function toggleToKiosk(val) {
        if (val) {
            vm.shippingAddress.address = vm.currentUser.kiosk.address;
        }
        else {
            vm.shippingAddress.address = '';
        }
    }
}
angular.module('app')
    .controller('OrderConfirmMessageController', OrderConfirmMessageController);

OrderConfirmMessageController.$inject = ['$stateParams'];

function OrderConfirmMessageController($stateParams) {
    var vm = this;
    
    vm.code = $stateParams.code;
}
angular.module('app')
    .controller('OrderConfirmController', OrderConfirmController);

OrderConfirmController.$inject = ['$state', '$window', 'toastr', 'Order', 'OrderService', '$timeout', '$filter', 'AuthenticationState'];
function OrderConfirmController($state, $window, toastr, Order, OrderService, $timeout, $filter, AuthenticationState) {
    var vm = this;

    vm.order = {};
    vm.submitOrder = submitOrder;
    vm.cancelOrder = cancelOrder;
    vm.currentUser = AuthenticationState.getUser();
    vm.isStaff = AuthenticationState.isStaff();
    
    console.log(vm.currentUser);

    function submitOrder(order) {
        if (confirm('Apakah anda yakin ingin melakukan pemesanan?')) {
            // submit order
            var convertedOrder = {
                KioskCode: order.kioskCode,
                InChargeEmail: vm.isStaff ? vm.currentUser.email : '',
                IdCard: order.idCard,
                Name: order.name,
                Email: order.email,
                Latitude: 0,
                Longitude: 0,
                SelfPickUp: order.toKiosk,
                Address: order.address,
                Phone: order.phone,
                //DP: $filter('totalDPNominal')(order.items),
                //TotalQuantity: $filter('sum')(order.items, 'quantity'),
                //TotalShippingFee: 0,
                //TotalPrice: $filter('totalPrice')(order.items),
                //IsFullyPaid: false,
                OrderDetails: []
            };

            for (var i = 0, length = order.items.length; i < length; i++) {
                var item = order.items[i];

                convertedOrder.OrderDetails
                    .push({
                        ProductCode: item.code,
                        Quantity: item.quantity,
                        //Price: item.price,
                        //ShippingFee: 0,
                        //DPNominal: item.dp * item.price / 100,
                        DealerCode: item.dealerCode
                    });
            }

            vm.loadingCreateDraft = true;
            OrderService.createDraft(convertedOrder)
                .then(function (res) {
                    Order.initiateOrder();

                    //$timeout(function () {
                    window.location.href = 'confirm-message/' + res.result.Code;
                    //}, 1000);

                    //$state.go('confirm-message', { code: res.result.Code });
                })
                .catch(function (err) {
                    toastr.error(err);
                })
                .finally(function () {
                    vm.loadingCreateDraft = false;
                });
        }
    }

    function cancelOrder() {
        if (confirm('Apakah anda yakin ingin membatalkan pemesanan?')) {
            Order.initiateOrder();

            toastr.warning('Pesanan Anda telah berhasil dibatalkan.', 'Success');

            $timeout(function () {
                window.location.href = '';
            }, 2000);
        }
    }

    (function () {
        vm.order = Order.getCurrentOrder();

        if (vm.order.items.length == 0) {
            toastr.warning('Keranjang belanja Anda kosong.');
            $state.go('app.home');
        }
    })();
};
angular.module('app')
    .controller('OrderDetailModalController', OrderDetailModalController);

OrderDetailModalController.$inject = ['code', 'OrderService', '$uibModalInstance', '$window', 'toastr'];
function OrderDetailModalController(code, OrderService, $uibModalInstance, $window, toastr) {
    var vm = this;
    vm.order = {};
    vm.close = close;
    vm.print = print;

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                vm.order = res;
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function print() {
        $window.print();
    }

    function close() {
        $uibModalInstance.dismiss('cancel');
    }

    (function () {
        getOrderByCode(code);
    })();
}
angular.module('app')
    .controller('OrderCheckInController', OrderCheckInController);

OrderCheckInController.$inject = ['OrderService', 'toastr'];
function OrderCheckInController(OrderService, toastr) {
    var vm = this;
    vm.getOrder = getOrder;
    // vm.arriveOrder = arriveOrder;
    vm.arriveOrderDetail = arriveOrderDetail

    function getOrder(code) {
        vm.loadingGetOrder = true;
        OrderService.getByCode(code)
            .then(order => {
                if (order.Status != 'DELIVERED'
                    && order.Status != 'PARTIALLY DELIVERED'
                    && order.Status != 'PARTIALLY ARRIVED') {
                    toastr.error(`Invalid status: ${order.Status}`);
                    return;
                }

                if (!order.SelfPickUp) {
                    toastr.error('This order should be delivered to customer');
                    return;
                }

                vm.order = order;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingGetOrder = false;
            });
    }

    // function arriveOrder(order) {
    //     vm.loadingArriveOrder = true;
    //     OrderService.arrive(order.Code)
    //         .then(res => {
    //             toastr.success('Pesanan telah berhasil diterima di outlet.');
    //             delete vm.order;
    //         })
    //         .catch(err => {
    //             toastr.error(err);
    //         })
    //         .finally(() => {
    //             vm.loadingArriveOrder = false;
    //         });
    // }

    function arriveOrderDetail(orderDetail) {
        orderDetail.loading = true;

        OrderService.detailArrive(orderDetail.OrderCode, orderDetail.Code)
            .then(response => {
                if (response.result)
                    return OrderService.getByCode(orderDetail.OrderCode);
            })
            .then(response => {
                vm.order = response;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                orderDetail.loading = false;
            });
    }
}
angular.module('app')
    .controller('OrderController', OrderController);

OrderController.$inject = ['$state'];
function OrderController($state) {
    var vm = this;
}
angular.module('app')
    .controller('OrderDetailController', OrderDetailController);

OrderDetailController.$inject = ['$state', '$rootScope', '$filter', '$window', '$stateParams', 'AuthenticationState', 'OrderService', 'ShippingService', 'toastr'];
function OrderDetailController($state, $rootScope, $filter, $window, $stateParams, AuthenticationState, OrderService, ShippingService, toastr) {
    var vm = this;

    var weightRoundingLimit = 0.3;// default

    vm.order = {};
    vm.currentUser = AuthenticationState.getUser();
    vm.isStaff = AuthenticationState.isStaff();

    vm.toggleSelfPickUp = toggleSelfPickUp;
    vm.updateDraft = updateDraft;
    vm.back = back;
    vm.voidDraft = voidDraft;
    vm.getLocations = getLocations;
    vm.selectLocation = selectLocation;
    vm.selectPricingOption = selectPricingOption;
    vm.updateDetail = updateDetail;
    vm.removeCurrentShippingInformation = removeCurrentShippingInformation;
    vm.calculate = calculate;


    (function () {
        var code = $stateParams.code;
        if (!code) {
            $state.go('app.order');
        }

        getOrderByCode(code);
        getWeightRoundingLimit();
    })();

    function toggleSelfPickUp(val) {
        if (val) {
            vm.order.Address = vm.currentUser.kiosk.address;

            removeCurrentShippingInformation();

            delete vm.destination;
            delete vm.pricingOption;
        }
        else {
            vm.order.Address = '';
        }
    }

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                if (res.Status != 'DRAFTED') {
                    $state.go('app.order.draft');
                }

                vm.order = res;

                if (vm.order.ShippingDestination && vm.order.ShippingProductCode) {
                    console.log('Fetching shipping information');
                    return selectLocation(vm.order.ShippingDestination)
                        .then(() => {
                            console.log('Success fetching shipping information');
                            selectPricingOption(vm.pricingOptions.find(t => t.productCode == vm.order.ShippingProductCode));
                        });
                }
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function updateDraft(order) {

        vm.loadingUpdateDraft = true;

        var orderToBeUpdated = {
            Code: order.Code,
            KioskCode: order.KioskCode,
            InChargeEmail: vm.isStaff ? vm.currentUser.email : '',
            IdCard: order.IdCard,
            Name: order.Name,
            Email: order.Email,
            Address: order.Address,
            SelfPickUp: order.SelfPickUp,
            Phone: order.Phone,
            ShippingDestination: order.ShippingDestination,
            ShippingProductCode: order.ShippingProductCode,
            ShippingDueDay: order.ShippingDueDay,
            TotalShippingFee: order.TotalShippingFee,
            OrderDetails: []
        };

        for (var i = 0, length = order.OrderDetails.length; i < length; i++) {
            var detail = order.OrderDetails[i];
            orderToBeUpdated.OrderDetails.push({
                Code: detail.Code,
                OrderCode: detail.OrderCode,
                ProductCode: detail.ProductCode,
                DealerCode: detail.DealerCode,
                Quantity: detail.Quantity
            });
        }

        OrderService.updateDraft(orderToBeUpdated)
            .then(function (res) {
                $state.go('app.order-payment', { code: order.Code });
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingUpdateDraft = false;
            });
    }

    function back() {
        $window.history.back();
    }

    function voidDraft(code) {
        if (confirm('Apakah Anda yakin untuk membatalkan pesanan ini?')) {
            vm.loadingVoidDraft = true;
            OrderService.voidDraft(code)
                .then(function (res) {
                    toastr.info('Pesanan telah dibatalkan.');
                    $state.go('app.order.draft');
                })
                .catch(function (err) {
                    toastr.error(err);
                })
                .finally(function () {
                    vm.loadingVoidDraft = false;
                });
        }

    }

    function getLocations(keyword) {
        return ShippingService.getLocations(keyword)
            .then(res => {
                return res.result;
            });
    }

    function selectLocation(destination) {
        vm.loadingPricings = true;
        return ShippingService.getPricings(vm.currentUser.kiosk.branchName, destination, 1)
            .then(res => {
                vm.pricingOptions = res.result[0].pricingOptions;
            })
            .catch(err => {
                toastr.error(err);
            })
            .finally(() => {
                vm.loadingPricings = false;
            })
    }

    function selectPricingOption(pricingOption) {
        vm.pricingOption = pricingOption;
        vm.order.ShippingProductCode = pricingOption.productCode;
        vm.order.ShippingDestination = vm.destination ? vm.destination.display : vm.order.ShippingDestination;
        vm.order.ShippingDueDay = pricingOption.dueDay;

        calculate();
    }

    function updateDetail(detail) {
        detail.ShippingFee = (vm.pricingOption) ? vm.pricingOption.calculationResult : 0;

        calculate();
    }

    function calculate() {
        vm.order.TotalShippingFee = 0;
        vm.order.TotalPrice = 0;

        if (!vm.order.SelfPickUp) {
            // Set buat distinct value, Array.from buat convert Set > Array
            var dealerCodes = Array.from(new Set(vm.order.OrderDetails.map(t => t.DealerCode)));

            for (var i = 0, length = dealerCodes.length; i < length; i++) {
                var weight = vm.order.OrderDetails
                    .filter(t => t.DealerCode == dealerCodes[i]) // filter by dealer code
                    .map(t => t.Quantity * t.Product.Weight) // bikin array baru yang isinya berat * quantity
                    .reduce((a, b) => { return a + b }); // total berat

                // pembulatan
                if (weight == 0)
                    weight = 0;
                else if (weight < 1)
                    weight = 1;
                else if (weight - Math.floor(weight) > weightRoundingLimit)
                    weight = Math.ceil(weight);
                else
                    weight = Math.floor(weight);

                vm.order.TotalShippingFee += weight * vm.pricingOption.calculationResult;
            }
        }

        for (var i = 0, length = vm.order.OrderDetails.length; i < length; i++) {
            vm.order.TotalPrice += vm.order.OrderDetails[i].Quantity * vm.order.OrderDetails[i].Product.Price;
        }
    }

    function removeCurrentShippingInformation() {
        delete vm.pricingOption;
        vm.order.ShippingDestination = '';
        vm.order.ShippingProductCode = '';
        vm.order.ShippingDueDay = 0;
        vm.order.TotalShippingFee = 0;
    }

    function getWeightRoundingLimit() {
        return ShippingService.getWeightRoundingLimit()
            .then(res => {
                weightRoundingLimit = res.result;
            });
    }


}
angular.module('app')
    .controller('OrderDraftController', OrderDraftController);

OrderDraftController.$inject = ['OrderService', 'toastr', '$q', 'AuthenticationState'];
function OrderDraftController(OrderService, toastr, $q, AuthenticationState) {
    var vm = this;
    vm.currentUser = AuthenticationState.getUser();
    vm.changePage = changePage;
    vm.getOrders = getOrders;

    function initQuery() {
        return {
            keyword: '',
            orderBy: '-CreatedDate',
            page: 1,
            limit: 9
        };
    }

    function getOrders(query) {

        var promises = [];
        promises.push(OrderService.getAllDraft(query, vm.currentUser.kiosk.code));

        promises.push(OrderService.countAllDraft(query, vm.currentUser.kiosk.code));

        vm.loadingGetOrders = true;
        vm.isError = false;

        $q.all(promises)
            .then(function (responses) {
                var response = responses[0];
                vm.orders = response;

                response = responses[1];
                vm.orderQuery.count = response.count;
            })
            .catch(function (err) {
                vm.isError = true;
            })
            .finally(function () {
                vm.loadingGetOrders = false;
            });

    }

    function changePage() {
        getOrders(vm.orderQuery);
    }

    (function () {
        vm.orders = [];
        vm.orderQuery = initQuery();

        getOrders(vm.orderQuery);
    })();
}
angular.module('app')
    .controller('OrderHistoryController', OrderHistoryController);

OrderHistoryController.$inject = ['OrderService', '$uibModal', '$q', 'AuthenticationState'];
function OrderHistoryController(OrderService, $uibModal, $q, AuthenticationState) {
    var vm = this;
    vm.changePage = changePage;
    vm.openDetail = openDetail;
    vm.currentUser = AuthenticationState.getUser();

    function initQuery() {
        return {
            keyword: '',
            orderBy: '-CreatedDate',
            page: 1,
            limit: 9
        };
    }

    function getOrders(query) {
        var promises = [];

        promises.push(
            OrderService.getAllHistory(query, vm.currentUser.kiosk.code)
                .then(function (response) {
                    vm.orders = response;
                })
        );

        promises.push(
            OrderService.countAllHistory(query, vm.currentUser.kiosk.code)
                .then(function (res) {
                    vm.orderQuery.count = res.count;
                })
        );

        vm.loadingGetOrders = true;
        $q.all(promises)
            .then(function (res) {
            })
            .catch(function (err) {
            })
            .finally(function () {
                vm.loadingGetOrders = false;
            });

    }

    function changePage() {
        getOrders(vm.orderQuery);
    }

    function openDetail(code) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'app/order/detail.modal.html',
            controller: 'OrderDetailModalController',
            controllerAs: 'vm',
            size: 'lg',
            resolve: {
                code: function () {
                    return code;
                }
            }
        });
    }

    (function () {
        vm.orders = [];
        vm.orderQuery = initQuery();

        getOrders(vm.orderQuery);
    })();
}
angular.module('app')
    .controller('OrderTrackController', OrderTrackController);

OrderTrackController.$inject = ['OrderService', '$state', '$stateParams'];
function OrderTrackController(OrderService, $state, $stateParams) {
    var vm = this;
    vm.code = '';
    vm.submitOrder = submitOrder;

    function submitOrder(code) {
        $state.go('app.order.track', { code: code });
    }

    (function () {
        vm.code = $stateParams.code;

        if (vm.code) {
            getOrder(vm.code);
        }
    })();

    function getOrder(code) {
        vm.loadingGetOrder = true;
        vm.message = '';
        OrderService.getByCode(code)
            .then(function (order) {
                vm.order = order;
            })
            .catch(err => {
                vm.message = err;
            })
            .finally(() => {
                vm.loadingGetOrder = false;
            });
    }
}
angular.module('app')
    .controller('OrderVerifyController', OrderVerifyController);

OrderVerifyController.$inject = ['OrderService', 'toastr', '$filter', '$timeout', '$state', '$window'];
function OrderVerifyController(OrderService, toastr, $filter, $timeout, $state, $window) {
    var vm = this;

    //vm.confirmPayment = confirmPayment;
    vm.searchOrderByCodeAndPin = searchOrderByCodeAndPin;
    vm.pay = pay;
    vm.completeOrder = completeOrder;
    vm.goToPrint = goToPrint;

    function searchOrderByCodeAndPin(code, pin) {
        vm.loadingGetOrder = true;

        OrderService.getByCodePIN(code, pin)
            .then(function (response) {
                if (response.length == 0) {
                    toastr.error('Anda memasukkan Kode/PIN yang salah.', 'Pesan');
                    return;
                }

                var order = response[0];

                vm.order = order;

                var currentPaidAmount = $filter('sum')(vm.order.OrderPayments, 'PaidAmount');

                vm.orderPayment = {
                    PaymentType: 'FULFILLMENT',
                    OrderCode: order.Code,
                    PaidAmount: order.TotalPrice + order.TotalShippingFee - currentPaidAmount,
                    Amount: order.TotalPrice + order.TotalShippingFee - currentPaidAmount
                };
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrder = false;
            });
    }

    function pay(orderPayment) {
        if (orderPayment.Amount > orderPayment.PaidAmount) {
            toastr.error('Insufficient funds');
            return;
        }

        vm.loadingPay = true;

        OrderService.pay(orderPayment)
            .then(function (res) {
                //return OrderService.updatePaymentStatus(res.result.Code);
                // vm.order = res.result;

                return searchOrderByCodeAndPin(vm.code, vm.pin);
            })
            //.then(function (res) {
            //    vm.order = res.result;
            //})
            .catch(function (err, error) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingPay = false;
            });
    }

    //function confirmPayment(order) {
    //    vm.loadingConfirmPayment = true;

    //    var data = {
    //        orderCode: vm.order.Code,
    //        amount: vm.order.TotalPrice - $filter('sum')(vm.order.OrderPayments, 'Amount')
    //    };

    //    OrderService.complete(data)
    //        .then(function (response) {
    //            toastr.success('Your order has been verified successfully');
    //        })
    //        .catch(function (response) {
    //            var error = response.data.error;

    //            toastr.warning(error.message, error.status + ' - ' + error.code + ' - ' + error.name);
    //        })
    //        .finally(function () {
    //            vm.loadingConfirmPayment = false;
    //        });

    //}

    function completeOrder(order) {
        vm.loadingCompleteOrder = true;
        OrderService.complete(order.Code)
            .then(function (res) {
                toastr.success('Pesanan telah diterima oleh customer.');
                return searchOrderByCodeAndPin(vm.code, vm.pin);
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingCompleteOrder = false;
            });
    }

    function goToPrint() {
        var paymentId = $filter('orderBy')(vm.order.OrderPayments, '-TransactionDate')[0].id;

        var url = $state.href('blank.invoice', { code: vm.order.Code, paymentId: paymentId });
        $window.open(url, '_blank');
    }


}
angular.module('app')
    .controller('OrderPaymentController', OrderPaymentController);

OrderPaymentController.$inject = ['$rootScope', '$filter', '$stateParams', '$state', '$window', 'toastr', 'Order', 'OrderService', '$uibModal'];
function OrderPaymentController($rootScope, $filter, $stateParams, $state, $window, toastr, Order, OrderService, $uibModal) {
    var vm = this;

    vm.order = {};
    vm.orderPayment = {};
    vm.pay = pay;
    vm.changePaymentType = changePaymentType;
    vm.goToPrint = goToPrint;
    vm.confirmPayment = confirmPayment;
    // vm.changePaidAmount = changePaidAmount;

    // function changePaidAmount() {
    //     var total = vm.order.TotalPrice + vm.order.TotalShippingFee;
    //     if (vm.orderPayment.PaidAmount >= total) {
    //         vm.orderPayment.PaymentType = 'FULL PAYMENT';
    //         changePaymentType('FULL PAYMENT');
    //     }
    // }

    function getOrderByCode(code) {
        vm.loadingGetOrderByCode = true;
        OrderService.getByCode(code)
            .then(function (res) {
                if (res.IsFullyPaid) {
                    toastr.error('Pesanan sudah dibayar.');
                    $state.go('app.order.draft');
                }

                if (res.Status == 'REQUESTED') {
                    $state.go('app.order.draft');
                }

                vm.order = res;

                vm.orderPayment = {
                    OrderCode: code,
                    PaidAmount: 0,
                    Amount: vm.order.TotalPrice + vm.order.TotalShippingFee - vm.order.DP,
                    PaymentType: 'FULL PAYMENT'
                };

                changePaymentType('FULL PAYMENT');
            })
            .catch(function (err) {
                toastr.error(err);
            })
            .finally(function () {
                vm.loadingGetOrderByCode = false;
            });
    }

    function pay(orderPayment) {
        vm.loadingPay = true;
        OrderService.pay(orderPayment)
            .then(res => {
                return OrderService.getByCode(orderPayment.OrderCode)
                // vm.orderToBePrinted = res.result;
                // vm.message = 'Pesanan Anda telah berhasil dilakukan!';
            })
            .then(res => {
                vm.orderToBePrinted = res;
                vm.message = 'Pesanan Anda telah berhasil dilakukan!';
            })
            .catch(function (res) {
                toastr.error(res);
            })
            .finally(function () {
                vm.loadingPay = false;
            });
    }

    function confirmPayment(orderPayment) {
        if (orderPayment.Amount > orderPayment.PaidAmount) {
            toastr.error('Insufficient funds!');
            return;
        }
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'paymentConfirmation.html',
            controller: 'PaymentConfirmationController',
            controllerAs: 'vm',
            size: 'md',
            resolve: {
                order: function () { return vm.order; },
                orderPayment: function () { return orderPayment; }
            }
        });

        modalInstance.result
            .then(res => {
                return pay(orderPayment);
            });
    }


    function changePaymentType(val) {
        vm.orderPayment.Amount = vm.order.TotalShippingFee;
        if (val == 'FULL PAYMENT') {
            vm.orderPayment.Amount += vm.order.TotalPrice;
            vm.orderPayment.PaidAmount = vm.orderPayment.Amount;
        }
        else if (val == 'DOWN PAYMENT') {
            vm.orderPayment.Amount += vm.order.DP;
            vm.orderPayment.PaidAmount = 0;
        }
    }

    function goToPrint() {
        var paymentId = $filter('orderBy')(vm.orderToBePrinted.OrderPayments, '-TransactionDate')[0].id;

        var url = $state.href('blank.invoice', { code: vm.orderToBePrinted.Code, paymentId: paymentId });
        $window.open(url, '_blank');
    }

    (function () {
        var code = $stateParams.code;

        getOrderByCode(code);
    })();

}

angular.module('app')
    .controller('PaymentConfirmationController', PaymentConfirmationController);

PaymentConfirmationController.$inject = ['$uibModalInstance', 'order', 'orderPayment'];
function PaymentConfirmationController($uibModalInstance, order, orderPayment) {
    var vm = this;
    vm.orderPayment = orderPayment;

    vm.ok = ok;
    vm.cancel = cancel;

    (function () {
        if (order.TotalPrice + order.TotalShippingFee <= orderPayment.PaidAmount) {
            vm.orderPayment.PaymentType = 'FULL PAYMENT';
            vm.orderPayment.Amount = vm.orderPayment.PaidAmount = order.TotalPrice + order.TotalShippingFee;
        }
    })();

    function ok() {
        $uibModalInstance.close();
    }

    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }
}
angular.module('app')
    .directive('orderDetail', orderDetail);

function orderDetail() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '='
        },
        templateUrl: 'app/order/_detail.html'
    }
}