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

          function onLoad(result) {
            console.log(JSON.stringify(result));
            vm.practice = result.data;
          };

          PracticeService.loadPractice($stateParams.practiceId, onLoad);

          PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);

          function onLoadEvents (events) {
            vm.events = events.data;

            for (var i = vm.events.length - 1; i >= 0; i--) {
              vm.events[i].id = extractId(vm.events[i].hRef);
              vm.events[i].eventDate = parseEventDate(vm.events[i].eventDate);
            }
          }

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            return moment().locale('it').calendar(date);
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
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '50px')
          ];
          
        }
    }
})();