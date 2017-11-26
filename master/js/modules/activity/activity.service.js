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
        this.saveActivity = saveActivity;
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

        function saveActivity(activity, onReady) {
          var activityEndpoint = $rootScope.app.apiUrl + 'activities/' + getId(activity);
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending activity data'); };
          addCreatorIdToModel(activity);

          activity.creatorId = $rootScope.user.id;

          function getId(activity) {
            if (activity.id == undefined || activity.id == null) {
              return "";
            }

            return activity.id;
          };

          $http
            .post(activityEndpoint, activity, config)
            .then(onReady, onError);
        }

        function addCreatorIdToModel(activity) {
          activity.creatorId = $rootScope.user.id;
        }
    }

})();