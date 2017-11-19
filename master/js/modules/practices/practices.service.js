// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.practices')
        .service('PracticesService', PracticesService);

    PracticesService.$inject = ['$resource', '$rootScope', '$http', 'AuthenticationService', 'AUTH'];
    function PracticesService($resource, $rootScope, $http, AuthenticationService, AUTH) {
        this.getPractices = getPractices;
        var vm = this;

        function getPractices(params, onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'legalPractices' + params;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading practice'); };

          $http
            .get(practicesApi, config)
            .then(onReady, onError);
        }
    }

})();