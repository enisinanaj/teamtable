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

              vm.events[i].redUrgency = false;
              vm.events[i].yellowUrgency = false;
              vm.events[i].greenUrgency = false;

              if (vm.events[i].urgencyCode == 'red') 
                vm.events[i].redUrgency = true;
              if (vm.events[i].urgencyCode == 'yellow')
                vm.events[i].yellowUrgency = true;
              if (vm.events[i].urgencyCode == 'green')
                vm.events[i].greenUrgency = true;

              if ((!vm.events[i].greenUrgency) && (!vm.events[i].yellowUrgency) && (!vm.events[i].redUrgency)) {
                vm.events[i].greenUrgency = true;
              }
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

          vm.deletePractice = deletePractice;

          function deletePractice() {
            if (vm.events.length == 0) {
              PracticeService.deletePractice(vm.practice.id, onDelete);
            } else {
              alert("ATTENZIONE: non è possibile eliminare una pratica con eventi ad essa collegati");
            }

            function onDelete(data) {              
              $state.go('app.practices_management');
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

          vm.deleteEvent = deleteEvent;

          function deleteEvent(eventId) {
            PracticeService.loadActivities("?event=" + eventId, onLoadActivities);

            function onLoadActivities(activities) {
              vm.activities = activities.data;

              if (vm.activities.length == 0) {
                EventService.deleteEvent(eventId, onDelete);
              } else {
                alert("ATTENZIONE: non è possibile eliminare un'evento con attività ad esso collegate");
              }

              function onDelete(data) {              
                PracticeService.loadEvents("?practice=" + $stateParams.practiceId, onLoadEvents);
              };
            };
            
          }

          vm.showArchived = false;

          vm.dtInstance = {};

          $scope.reloadData = function() {
             vm.dtInstance._renderer.rerender();             
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
              date = date.replace(/Z.*/, '') + "+01:00"
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
            .withOption("info", false)
            .withOption('order', [1, 'desc']);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0),
              DTColumnDefBuilder.newColumnDef(1).withOption("type", "date-eu").withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '100px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '170px')
          ];
          
        }
    }
})();
