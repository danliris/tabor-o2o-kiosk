angular
    .module('app')
    .service('OrderService', OrderService);

OrderService.$inject = ['$http', 'Urls'];

function OrderService($http, Urls) {
	return {
		create: create
	};

	function create(order) {
		return $http.post(Urls.BASE_API + '/orders/create', order)
		    .then(handleSuccess, handleError('Error creating an order'));
	}

	function handleSuccess(response) {
		return response.data;
	}

	function handleError(error) {
		return function () {
			return { success: false, message: error };
		};
	}
}