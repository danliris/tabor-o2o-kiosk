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
