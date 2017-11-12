/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.practices')
        .controller('PracticesController', PracticesController);

    PracticesController.$inject = ['$scope', '$window', '$state', 
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'PracticesService'];
    
    function PracticesController($scope, $window, $state,
      $resource, DTOptionsBuilder, DTColumnDefBuilder, PracticesService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Ajax

          PracticesService.getPractices("", onDone);

          function onDone (practices) {
            vm.elements = practices.data;

            for (var i = vm.elements.length - 1; i >= 0; i--) {
              vm.elements[i].id = extractId(vm.elements[i].hRef);
            }
          };

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguageSource("//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json")
            .withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy',  className: 'btn-sm', text: 'Copia'},
                {extend: 'csv',   className: 'btn-sm'},
                {extend: 'print', className: 'btn-sm'}
            ])
            .withOption("info", false);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withOption('width', '160px'),
              DTColumnDefBuilder.newColumnDef(1).withOption('width', '200px'),
              DTColumnDefBuilder.newColumnDef(2)
          ];
        }
    }
})();
