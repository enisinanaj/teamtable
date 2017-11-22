/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.practice')
        .controller('PracticeController', PracticeController);

    PracticeController.$inject = ['$scope', '$window', '$state', '$stateParams', 
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'PracticeService'];
    
    function PracticeController($scope, $window, $state, $stateParams, 
      $resource, DTOptionsBuilder, DTColumnDefBuilder, PracticeService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.practice = {};

          //LOAD DATA
          if (idPresent()) {
            PracticeService.loadPractice($stateParams.practiceId, onLoad);
            PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
          }

          function onLoad(result) {
            vm.practice = result.data;
          };

          function onLoadEvents (events) {
            vm.events = events.data;

            for (var i = vm.events.length - 1; i >= 0; i--) {
              vm.events[i].id = extractId(vm.events[i].hRef);
              vm.events[i].eventDate = parseEventDate(vm.events[i].eventDate);
            }
          };

          function idPresent() {
            return $stateParams.id != null;
          }

          //INSERTION

          vm.savePractice = savePractice;

          function savePractice() {
            PracticeService.savePractice(vm.practice, onSave);

            function onSave(result, id) {
              $state.go('app.practices')
            };
          }

          //UTILITIES

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            return moment(date).format('DD/MM/YYYY');
          }

          //DATATABLE

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
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '50px')
          ];
          
        }
    }
})();
