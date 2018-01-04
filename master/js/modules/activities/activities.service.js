// Activities service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.activities')
        .service('ActivitiesService', ActivitiesService);

    ActivitiesService.$inject = ['$resource', '$rootScope', '$http', 'AuthenticationService', 'AUTH'];
    function ActivitiesService($resource, $rootScope, $http, AuthenticationService, AUTH) {
        this.getActivities = getActivities;
        var vm = this;

        function getActivities(params, onReady) {
          var activitiesApi = $rootScope.app.apiUrl + 'activities/' + params;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading activities'); };

          $http
            .get(activitiesApi, config)
            .then(onReady, onError);
        }
    }

})();