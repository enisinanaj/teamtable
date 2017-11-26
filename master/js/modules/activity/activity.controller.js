/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.activity')
        .controller('ActivityController', ActivityController);

    ActivityController.$inject = ['$scope', '$window', '$state', '$stateParams', 
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ActivityService'];
    
    function ActivityController($scope, $window, $state, $stateParams, 
      $resource, DTOptionsBuilder, DTColumnDefBuilder, ActivityService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.activity = {};

          // LOAD DATA

          function onLoad(result) {
            console.log(JSON.stringify(result));
            vm.activity = result.data;
            vm.activity.event.id = extractId(vm.activity.event.hRef);
            vm.activity.event.practice.id = extractId(vm.activity.event.practice.hRef);
            vm.activity.creationDate = parseEventDate(vm.activity.creationDate);
            vm.activity.completionDate = parseEventDate(vm.activity.completionDate);
            vm.activity.expirationDate = parseEventDate(vm.activity.expirationDate);
          };

          if (idPresent()) {
            ActivityService.loadActivity($stateParams.activityId, onLoad);
          }

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            date.replace(/\[.*\]/, '');
            return moment(date).format('DD/MM/YYYY');
          }

          function idPresent() {
            return $stateParams.activityId != undefined && $stateParams.activityId != 0;
          }

          //INSERTION

          vm.saveActivity = saveActivity;

          function saveActivity() {
            ActivityService.saveActivity(vm.activity, onSave);

            function onSave(data) {
              var id = vm.activity.id;
              
              if (vm.activity.id == undefined) {
                var hRef = data.headers()["location"];
                id = extractId(hRef);
              }
              
              $state.go('app.single_activity', {activityId: id})
            };
          }

          // CONFIGURATION

          vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguageSource("//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json")
            /*.withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy',  className: 'btn-sm', text: 'Copia'},
                {extend: 'csv',   className: 'btn-sm'},
                {extend: 'print', className: 'btn-sm'}
            ])*/
            .withOption("info", false);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withOption('width', '160px'),
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '50px')
          ];

          vm.goToEvent = function() {
            $state.go('app.single_event', {eventId: vm.activity.event.id});
          }

          vm.goToPractice = function() {
            $state.go('app.single_practice', {practiceId: vm.activity.event.practice.id});
          }
          
        }
    }
})();
