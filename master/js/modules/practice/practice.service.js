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

        function loadPractice(id, onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'legalPractices/' + id;

          var onError = function() { console.log('Failure loading practice'); };

          $http
            .get(practicesApi)
            .then(onReady, onError);
        }

        function loadEvents(filter, onReady) {
          var eventsApi = $rootScope.app.apiUrl + 'events/' + filter;

          var onError = function() { console.log('Failure loading practice'); };

          $http
            .get(eventsApi)
            .then(onReady, onError);
        }
    }

})();