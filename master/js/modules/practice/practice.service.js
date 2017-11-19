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
        this.savePractice = savePractice;

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

          practice.creatorId = "OQ";

          //var data = $.param(practice);

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

        function addCreatorIdToModel(model) {
          model.id = $rootScope.user.id;
        }
    }

})();