// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.practices')
        .service('PracticesService', PracticesService);

    PracticesService.$inject = ['$resource', '$rootScope', '$http'];
    function PracticesService($resource, $rootScope, $http) {
        this.getPractices = getPractices;

        function getPractices(params, onReady) {
          var practicesApi = $rootScope.app.apiUrl + 'legalPractices' + params;

          var onError = function() { console.log('Failure loading practice'); };

          $http
            .get(practicesApi)
            .then(onReady, onError);
        }
    }

})();