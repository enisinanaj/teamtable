// Events service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.event')
        .service('EventService', EventService);

    EventService.$inject = ['$resource', '$http', '$rootScope', 'AuthenticationService', 'AUTH'];
    function EventService($resource, $http, $rootScope, AuthenticationService, AUTH) {
        this.loadEvent = loadEvent;
        this.loadActivities = loadActivities;
        var vm = this;

        function loadEvent(id, onReady) {
          var eventsApi = $rootScope.app.apiUrl + 'events/' + id;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading event'); };

          $http
            .get(eventsApi, config)
            .then(onReady, onError);
        }

        function loadActivities(filter, onReady) {
          var activitiesApi = $rootScope.app.apiUrl + 'activities/' + filter;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading event'); };

          $http
            .get(activitiesApi, config)
            .then(onReady, onError);
        }
    }

})();