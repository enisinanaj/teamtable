/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.event')
        .controller('EventController', EventController);

    EventController.$inject = ['$scope', '$window', '$state', '$stateParams', '$rootScope',
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'EventService', 'ActivityService', 'UserService'];
    
    function EventController($scope, $window, $state, $stateParams, $rootScope,
      $resource, DTOptionsBuilder, DTColumnDefBuilder, EventService, ActivityService, UserService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          vm.event = {};
          vm.createActivity = "";
          vm.activity = {};

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
            vm.event.eventDate_dateFormat = new Date(cleanDate(vm.event.eventDate));
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
            if (date != null) {
              date = cleanDate(date);
              return moment(date).format('DD/MM/YYYY');
            } else {
              return null;
            }
          }

          function cleanDate(date) {
            return date.replace(/Z.*/, '') + "+01:00";
          }

          function idPresent() {
            return $stateParams.eventId != undefined && $stateParams.eventId != 0;
          }

          UserService.loadAllUsers(onLoadUsers);

          function onLoadUsers(result) {
            vm.users = result.data;
            for (var i = vm.users.length - 1; i >= 0; i--) {
              vm.users[i].id = extractId(vm.users[i].hRef);
            }
          };

          // INSERTION

          vm.saveEvent = saveEvent;

          function saveEvent() {
            //date correction
            vm.event.eventDate = moment(vm.event.eventDate_dateFormat).format("YYYY-MM-DDTHH:mm:ss") + ".000Z";

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

              if (vm.createActivity) {
                var newActivity = {
                    name: vm.event.description,
                    activityType: "",
                    assigneeId: vm.activity.assigneeId,
                    expirationDate_dateFormat: vm.event.eventDate,
                    description: "",
                    expirationDate: vm.event.eventDate,
                    creationDate: vm.event.creationDate,
                    eventId: id,
                    status: "OPEN"
                };

                ActivityService.saveActivity(newActivity, onSaveActivity);

                function onSaveActivity(data) {
                  var hRef = data.headers()["location"];
                  var actId = extractId(hRef);
                  
                  $state.go('app.add_activity', {activityId: actId, eventId: id})
                };

                return;
              }
              
              if (vm.createActivity) {
                return;
              } else {
                $state.go('app.single_event', {eventId: id})
              }
            };
          }

          vm.archiveEvent = archiveEvent;

          function archiveEvent() {
            EventService.archiveEvent(vm.event.id, onArchive);

            function onArchive(data) {
              EventService.loadEvent($stateParams.eventId, onLoad);
              EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
            };
          }

          vm.unarchiveEvent = unarchiveEvent;

          function unarchiveEvent() {
            EventService.unarchiveEvent(vm.event.id, onUnarchive);

            function onUnarchive(data) {
              EventService.loadEvent($stateParams.eventId, onLoad);
              EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
            };
          }

          vm.archiveActivity = archiveActivity;

          function archiveActivity(activityId) {
            ActivityService.archiveActivity(activityId, onArchiveActivity);

            function onArchiveActivity(data) {
              EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
            };
          }

          vm.unarchiveActivity = unarchiveActivity;

          function unarchiveActivity(activityId) {
            ActivityService.unarchiveActivity(activityId, onUnarchiveActivity);

            function onUnarchiveActivity(data) {
              EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
            };
          }

          vm.showArchived = false;

          vm.dtInstance = {};

          $scope.reloadData = function() {
             vm.dtInstance._renderer.rerender();             
          }

          vm.deleteEvent = deleteEvent;

          function deleteEvent() {
            if (vm.activities.length == 0) {
              vm.practice = vm.event.practice.id;
              EventService.deleteEvent(vm.event.id, onDelete);
            } else {
              alert("ATTENZIONE: non è possibile eliminare un'evento con attività ed esso collegate");
            }

            function onDelete(data) {              
              $state.go('app.single_practice', {practiceId: vm.practice});
            };
          }

          vm.deleteActivity = deleteActivity;

          function deleteActivity(activityId) {
            ActivityService.deleteActivity(activityId, onDeleteActivity);

            function onDeleteActivity(data) {
              EventService.loadActivities("?event=" + $stateParams.eventId, onLoadActivities);
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
              DTColumnDefBuilder.newColumnDef(1).withOption('width', '130px'),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '80px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '50px'),
              DTColumnDefBuilder.newColumnDef(4).withOption('width', '180px')
          ];
          
        }
    }
})();
