(function() {
	'use strict';

	angular.module('app.authentication')
		.service('AuthenticationService', AuthenticationService);


	AuthenticationService.$inject = ['$window', '$state', '$rootScope', '$stateParams', '$resource', 'AUTH', '$http', '$q'];

	function AuthenticationService($window, $state, $rootScope, $stateParams, $resource, AUTH, $http, $q) {

		var vm = this;
		var ss = AUTH['secret_key'];
		var apiKey = AUTH['api_key'];

		vm.generateToken = generateToken;

		function generateToken() {
			var querytime = Math.floor(new Date().getTime() / 1000);
			var toHash = apiKey + ss + querytime;
			return CryptoJS.SHA256(toHash);
		}

		vm.getProfile = function () {

		  if ($rootScope.user == undefined || $rootScope.app == undefined) {
		  	return $http.get('/');
		  }

		  var userPassword = CryptoJS.SHA256($rootScope.user.password).toString();
		  $rootScope.user.password = userPassword;

		  var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': vm.generateToken(),
                  'apiKey': AUTH['api_key'],
                  'principal': $rootScope.user.name,
                  'principal-token': userPassword
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending practice data'); };

		  return $http.post($rootScope.app.apiUrl + "/sessions", {}, config);
		};

	};

})();