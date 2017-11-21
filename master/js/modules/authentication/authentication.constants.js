(function() {
	'user strinct';


	angular.module("app.authentication")
		.constant('AUTH', {
			"secret_key": "secret_key",
			"api_key": "api_key"
		});

})();