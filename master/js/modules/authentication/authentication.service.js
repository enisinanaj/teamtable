(function() {
	'use strict';

	angular.module('app.authentication')
		.service('AuthenticationService', AuthenticationService);


	AuthenticationService.$inject = ['$window', '$state', '$rootScope', '$stateParams', '$resource', 'AUTH', '$http', '$q', '$cookies'];

	function AuthenticationService($window, $state, $rootScope, $stateParams, $resource, AUTH, $http, $q, $cookies) {

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

		  var cookieUserId = $cookies.get('principal');
		  console.log("cookie user id: " + cookieUserId);

		  if (cookieUserId != undefined && $rootScope.user.id == undefined) {
		  	$rootScope.user.id = cookieUserId;
		  } else if (cookieUserId != undefined && $rootScope.user.id != cookieUserId) {
		  	return $http.get('/');
		  }

		  if ($rootScope.user == undefined || $rootScope.app == undefined) {
		  	return $http.get('/');
		  }

		  var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };
          var userid = $rootScope.user.id != undefined ? $rootScope.user.id : 0;
          var onError = function() { console.log('Failure retrieving user data'); };

		  return $http.get($rootScope.app.apiUrl + "users/" + userid, config);
		};

	};

})();