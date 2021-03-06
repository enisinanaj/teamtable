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
        this.saveEvent = saveEvent;
        this.archiveEvent = archiveEvent;
        this.unarchiveEvent = unarchiveEvent;
        this.deleteEvent = deleteEvent;
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

        function saveEvent(event, onSave) {
          var eventEndpoint = $rootScope.app.apiUrl + 'events/' + getId(event);
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending event data'); };
          addCreatorIdToModel(event);

          event.creatorId = $rootScope.user.id;

          function getId(event) {
            if (event.id == undefined || event.id == null) {
              return "";
            }

            return event.id;
          };

          $http
            .post(eventEndpoint, event, config)
            .then(onSave, onError);
        }

        function archiveEvent(id, onReady) {
          var eventEndpoint = $rootScope.app.apiUrl + 'events/' + id;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending practice data'); };

          $http
            .post(eventEndpoint, {archived: true}, config)
            .then(onReady, onError);
        }

        function unarchiveEvent(id, onReady) {
          var eventEndpoint = $rootScope.app.apiUrl + 'events/' + id;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending practice data'); };

          $http
            .post(eventEndpoint, {archived: false}, config)
            .then(onReady, onError);
        }

        function deleteEvent(id, onReady) {
          var eventsEndpoint = $rootScope.app.apiUrl + 'events/' + id;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending event data'); };

          $http
            .delete(eventsEndpoint, config)
            .then(onReady, onError);
        }

        function addCreatorIdToModel(model) {
          model.creatorId = $rootScope.user.id;
        }
    }

})();