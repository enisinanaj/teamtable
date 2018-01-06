// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.practice')
        .service('PracticeService', PracticeService);

    PracticeService.$inject = ['$resource', '$http', '$rootScope', 'AuthenticationService', 'AUTH'];
    function PracticeService($resource, $http, $rootScope, AuthenticationService, AUTH) {
        this.loadPractice = loadPractice;
        this.loadEvents = loadEvents;
        this.loadActivities = loadActivities;
        this.savePractice = savePractice;
        this.archivePractice = archivePractice;
        this.unarchivePractice = unarchivePractice;
        this.deletePractice = deletePractice;

        var vm = this;

        function loadPractice(id, onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'legalPractices/' + id;
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

        function loadEvents(filter, onReady) {
          var eventsApi = $rootScope.app.apiUrl + 'events/' + filter;
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure loading practice\'s events'); };

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

          var onError = function() { console.log('Failure loading event\'s activities'); };

          $http
            .get(activitiesApi, config)
            .then(onReady, onError);
        }

        function savePractice(practice, onReady) {
          var practiceEndpoint = $rootScope.app.apiUrl + 'legalPractices/' + getId(practice);
          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          var onError = function() { console.log('Failure sending practice data'); };
          addCreatorIdToModel(practice);

          function getId(practice) {
            if (practice.id == undefined || practice.id == null) {
              return "";
            }

            return practice.id;
          };

          $http
            .post(practiceEndpoint, practice, config)
            .then(onReady, onError);
        }

        function archivePractice(id, onReady) {
          var practiceEndpoint = $rootScope.app.apiUrl + 'legalPractices/' + id;
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
            .post(practiceEndpoint, {archived: true}, config)
            .then(onReady, onError);
        }

        function unarchivePractice(id, onReady) {
          var practiceEndpoint = $rootScope.app.apiUrl + 'legalPractices/' + id;
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
            .post(practiceEndpoint, {archived: false}, config)
            .then(onReady, onError);
        }

        function deletePractice(id, onReady) {
          var practicesEndpoint = $rootScope.app.apiUrl + 'legalPractices/' + id;
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
            .delete(practicesEndpoint, config)
            .then(onReady, onError);
        }

        function addCreatorIdToModel(model) {
          model.creatorId = $rootScope.user.id;
        }
    }

})();