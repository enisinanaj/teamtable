/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.practices')
        .controller('PracticesController', PracticesController);

    PracticesController.$inject = ['$scope', '$state', 
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'Practice'];
    
    function PracticesController($scope, $state,
      $resource, DTOptionsBuilder, DTColumnDefBuilder, Practice) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Ajax

          $resource('server/datatable.json').query().$promise.then(function(practices) {
             vm.elements = practices;
          });

          vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguageSource("//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json")
            .withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy',  className: 'btn-sm', text: 'Copia'},
                {extend: 'csv',   className: 'btn-sm'},
                {extend: 'print', className: 'btn-sm'}
            ]);

          $scope.setCurrentPractice = function(practice) {
            //Practice.setCurrentPractice("aaaa");
            console.log("Practice name: " + practice);
            console.log("SAVED CURRENT PRACTICE");
          };

        }
    }
})();
