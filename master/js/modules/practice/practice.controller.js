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
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'PracticeService', 'EventService'];
    
    function PracticeController($scope, $window, $state, $stateParams, 
      $resource, DTOptionsBuilder, DTColumnDefBuilder, PracticeService, EventService) {
        
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
            vm.practice.id = $stateParams.practiceId;
          };

          function onLoadEvents (events) {
            vm.events = events.data;

            for (var i = vm.events.length - 1; i >= 0; i--) {
              vm.events[i].id = extractId(vm.events[i].hRef);
              vm.events[i].eventDate = parseEventDate(vm.events[i].eventDate);
            }
          };

          function idPresent() {
            return $stateParams.practiceId != null && $stateParams.practiceId != "";
          }

          //INSERTION

          vm.savePractice = savePractice;

          function savePractice() {
            PracticeService.savePractice(vm.practice, onSave);

            function onSave(data) {
              var id = vm.practice.id;
              
              if (vm.practice.id == undefined) {
                var hRef = data.headers()["location"];
                id = extractId(hRef);
              }
              
              $state.go('app.single_practice', {practiceId: id})
            };
          }

          vm.archivePractice = archivePractice;

          function archivePractice() {
            PracticeService.archivePractice(vm.practice.id, onArchive);

            function onArchive(data) {              
              PracticeService.loadPractice($stateParams.practiceId, onLoad);
              PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
            };
          }

          vm.unarchivePractice = unarchivePractice;

          function unarchivePractice() {
            PracticeService.unarchivePractice(vm.practice.id, onUnarchive);

            function onUnarchive(data) {              
              PracticeService.loadPractice($stateParams.practiceId, onLoad);
              PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
            };
          }

          vm.archiveEvent = archiveEvent;

          function archiveEvent(eventId) {
            EventService.archiveEvent(eventId, onArchive);

            function onArchive(data) {              
              PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
            };
          }

          vm.unarchiveEvent = unarchiveEvent;

          function unarchiveEvent(eventId) {
            EventService.unarchiveEvent(eventId, onArchive);

            function onArchive(data) {              
              PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
            };
          }

          //UTILITIES

          function extractId(hRef) {
            if (hRef == undefined) {
              return "";
            }

            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            if (date != null) {
              date.replace(/\[.*\]/, '');
              return moment(date).format('DD/MM/YYYY');
            } else {
              return null;
            }
          }

          //DATATABLE

          vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguageSource("//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json")
            /*.withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy',  className: 'btn-sm', text: 'Copia'},
                {extend: 'csv',   className: 'btn-sm'},
                {extend: 'print', className: 'btn-sm'}
            ])*/
            .withOption("lengthChange", false)
            .withOption("paging", false)
            .withOption("info", false);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withOption('width', '160px'),
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '140px')
          ];
          
        }
    }
})();
