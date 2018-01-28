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
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ActivityService', 'UserService'];
    
    function ActivityController($scope, $window, $state, $stateParams, 
                                $resource, DTOptionsBuilder, DTColumnDefBuilder, 
                                ActivityService, UserService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.activity = {};

          // LOAD DATA

          function onLoad(result) {
            vm.activity = result.data;
            vm.activity.id = extractId(vm.activity.hRef);
            vm.activity.event.id = extractId(vm.activity.event.hRef);
            vm.activity.event.practice.id = extractId(vm.activity.event.practice.hRef);

            vm.activity.creationDate_dateFormat = new Date(cleanDate(vm.activity.creationDate));
            vm.activity.creationDate = parseEventDate(vm.activity.creationDate);
            
            if (vm.activity.completionDate != undefined) {
              vm.activity.completionDate_dateFormat = new Date(cleanDate(vm.activity.completionDate));
            }

            vm.activity.completionDate = parseEventDate(vm.activity.completionDate);
            
            vm.activity.expirationDate_dateFormat = new Date(cleanDate(vm.activity.expirationDate));
            vm.activity.expirationDate = parseEventDate(vm.activity.expirationDate);
            vm.activity.assigneeId = extractId(vm.activity.assignee.hRef);
          };

          function onLoadUsers(result) {
            vm.users = result.data;
            for (var i = vm.users.length - 1; i >= 0; i--) {
              vm.users[i].id = extractId(vm.users[i].hRef);
            }
          };

          if (idPresent()) {
            ActivityService.loadActivity($stateParams.activityId, onLoad);
          }

          UserService.loadAllUsers(onLoadUsers);

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function parseEventDate(date) {
            if (date != null) {
              date = cleanDate(date);
              return moment(date).format('DD/MM/YYYY');
            } else {
              return '-';
            }
          }

          function cleanDate(date) {
            return date.replace(/Z.*/, '') + "+01:00";
          }

          function idPresent() {
            return $stateParams.activityId != undefined && $stateParams.activityId != 0 && $stateParams.activityId != "";
          }

          //INSERTION

          vm.saveActivity = saveActivity;

          function saveActivity() {
            //date correction
            vm.activity.expirationDate = moment(vm.activity.expirationDate_dateFormat).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
            vm.activity.creationDate = moment(vm.activity.creationDate_dateFormat).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

            if (vm.activity.completionDate_dateFormat != undefined) {
              vm.activity.completionDate = moment(vm.activity.completionDate_dateFormat).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";
            } else if (vm.activity.completionDate == '-') {
              delete vm.activity.completionDate;
            }

            if (vm.activity.event != undefined && vm.activity.event.id != undefined) {
              vm.activity.eventId = vm.activity.event.id;
            } else {
              vm.activity.eventId = $stateParams.eventId;
            }

            vm.activity.status = 'OPEN';

            if (vm.activity.activityType != '') {
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
          }

          vm.completeActivity = completeActivity;

          function completeActivity() {
            if ((vm.activity.completionDate != null) && (vm.activity.completionDate != '-')) { //Da rivedere con glassfish vm.activity.completionDate != '-'
              ActivityService.reopenActivity(vm.activity.id, onComplete);
            } else {
              ActivityService.completeActivity(vm.activity.id, onComplete);
            }            

            function onComplete() {
              ActivityService.loadActivity($stateParams.activityId, onLoad);
            }
          }

          vm.archiveActivity = archiveActivity;

          function archiveActivity() {
            ActivityService.archiveActivity(vm.activity.id, onArchive);

            function onArchive(data) {              
              ActivityService.loadActivity($stateParams.activityId, onLoad);
            };
          }

          vm.unarchiveActivity = unarchiveActivity;

          function unarchiveActivity() {
            ActivityService.unarchiveActivity(vm.activity.id, onUnarchive);

            function onUnarchive(data) {              
              ActivityService.loadActivity($stateParams.activityId, onLoad);
            };
          }

          vm.deleteActivity = deleteActivity;

          function deleteActivity() {
            vm.event = vm.activity.event.id;
            ActivityService.deleteActivity(vm.activity.id, onDelete);

            function onDelete(data) {              
              $state.go('app.single_event', {eventId: vm.event});
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
