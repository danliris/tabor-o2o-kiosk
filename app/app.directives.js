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