// Events service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.event')
        .service('EventService', EventService);

    EventService.$inject = ['$resource', '$http', '$rootScope'];
    function EventService($resource, $http, $rootScope) {
        this.loadEvent = loadEvent;
        this.loadActivities = loadActivities;

        function loadEvent(id, onReady) {
          var eventsApi = $rootScope.app.apiUrl + 'events/' + id;

          var onError = function() { console.log('Failure loading event'); };

          $http
            .get(eventsApi)
            .then(onReady, onError);
        }

        function loadActivities(filter, onReady) {
          var activitiesApi = $rootScope.app.apiUrl + 'activities/' + filter;

          var onError = function() { console.log('Failure loading event'); };

          $http
            .get(activitiesApi)
            .then(onReady, onError);
        }
    }

})();