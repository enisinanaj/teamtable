// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.user')
        .service('UserService', UserService);

    UserService.$inject = ['$resource', '$http', '$rootScope', 'AuthenticationService', 'AUTH'];
    function UserService($resource, $http, $rootScope, AuthenticationService, AUTH) {
        this.loadAllUsers = loadAllUsers;

        var vm = this;

        function loadAllUsers(onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'users/';
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading users'); };

          $http
            .get(practicesApi, config)
            .then(onReady, onError);
        }
    }

})();