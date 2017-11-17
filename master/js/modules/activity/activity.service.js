// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.activity')
        .service('ActivityService', ActivityService);

    ActivityService.$inject = ['$resource', '$http', '$rootScope'];
    function ActivityService($resource, $http, $rootScope) {
        this.loadActivity = loadActivity;

        function loadActivity(id, onReady) {
          var activitiesApi = $rootScope.app.apiUrl + 'activities/' + id;

          var onError = function() { console.log('Failure loading activity'); };

          $http
            .get(activitiesApi)
            .then(onReady, onError);
        }
    }

})();