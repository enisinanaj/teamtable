/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.event')
        .controller('EventController', EventController);

    EventController.$inject = ['$scope', '$window', '$state', '$stateParams', 
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'EventService'];
    
    function EventController($scope, $window, $state, $stateParams, 
      $resource, DTOptionsBuilder, DTColumnDefBuilder, EventService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.event = {};

          vm.goToPractice = function() {
            $state.go('app.single_practice', {practiceId: vm.event.practice.id});
            return;
          }

          // LOAD DATA

          if (idPresent()) {
            EventService.loadEvent($stateParams.eventId, onLoad);
            EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
          }

          function onLoad(result) {
            console.log(JSON.stringify(result));
            vm.event = result.data;

            vm.event.id = extractId(vm.event.hRef);
            vm.event.practice.id = extractId(vm.event.practice.hRef);
            vm.event.eventDate = parseEventDate(vm.event.eventDate);
          };

          function onLoadActivities (activities) {
            vm.activities = activities.data;

            for (var i = vm.activities.length - 1; i >= 0; i--) {
              vm.activities[i].id = extractId(vm.activities[i].hRef);
            }
          }

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            date.replace(/\[.*\]/, '');
            return moment(date).format('DD/MM/YYYY');
          }

          function idPresent() {
            return $stateParams.eventId != undefined && $stateParams.eventId != 0;
          }

          // INSERTION

          vm.saveEvent = saveEvent;

          function saveEvent() {
            if (vm.event.practice != undefined && vm.event.practice.id != undefined) {
              vm.event.practiceId = vm.event.practice.id;
            } else {
              vm.event.practiceId = $stateParams.practiceId;
            }

            EventService.saveEvent(vm.event, onSave);

            function onSave(data) {
              var id = vm.event.id;
              
              if (vm.event.id == undefined) {
                var hRef = data.headers()["location"];
                id = extractId(hRef);
              }
              
              $state.go('app.single_event', {eventId: id})
            };
          }

          // VIEW CONFIGURATION

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
              DTColumnDefBuilder.newColumnDef(0),
              DTColumnDefBuilder.newColumnDef(1).withOption('width', '160px'),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '50px'),
              DTColumnDefBuilder.newColumnDef(4).withOption('width', '50px')
          ];
          
        }
    }
})();
