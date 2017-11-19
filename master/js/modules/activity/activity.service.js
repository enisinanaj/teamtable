// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.activity')
        .service('ActivityService', ActivityService);

    ActivityService.$inject = ['$resource', '$http', '$rootScope', 'AuthenticationService', 'AUTH'];
    function ActivityService($resource, $http, $rootScope, AuthenticationService, AUTH) {
        this.loadActivity = loadActivity;
        var vm = this;

        function loadActivity(id, onReady) {
          var activitiesApi = $rootScope.app.apiUrl + 'activities/' + id;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading activity'); };

          $http
            .get(activitiesApi, config)
            .then(onReady, onError);
        }
    }

})();