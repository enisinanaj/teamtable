// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.practice')
        .service('PracticeService', PracticeService);

    PracticeService.$inject = ['$resource', '$http', '$rootScope'];
    function PracticeService($resource, $http, $rootScope) {
        this.loadPractice = loadPractice;
        this.loadEvents = loadEvents;
        this.savePractice = savePractice;

        function loadPractice(id, onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'legalPractices/' + id;

          var onError = function() { console.log('Failure loading practice'); };

          $http
            .get(practicesApi)
            .then(onReady, onError);
        }

        function loadEvents(filter, onReady) {
          var eventsApi = $rootScope.app.apiUrl + 'events/' + filter;

          var onError = function() { console.log('Failure loading practice\'s events'); };

          $http
            .get(eventsApi)
            .then(onReady, onError);
        }

        function savePractice(practice, onReady) {
          var practiceEndpoint = $rootScope.app.apiUrl + 'legalPractices/' + (practice.id || '');

          var onError = function() { console.log('Failure sending practice data'); };

          addCreatorIdToModel(practice);

          var data = $.param(practice);
          var config = {
              headers : {
                  'Content-Type': 'application/json;'
              }
          };

          $http
            .post(practiceEndpoint, data, config)
            .then(onReady, onError);
        }

        function addCreatorIdToModel(model) {
          model.id = $rootScope.user.id;
        }
    }

})();