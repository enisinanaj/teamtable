/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.activities')
        .controller('ActivitiesController', ActivitiesController);

    ActivitiesController.$inject = ['$scope', '$window', '$state', '$stateParams',
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'ActivitiesService'];
    
    function ActivitiesController($scope, $window, $state, $stateParams,
      $resource, DTOptionsBuilder, DTColumnDefBuilder, ActivitiesService) {
        
        var vm = this;

        activate();

        ////////////////

        function activate() {

          // Ajax

          var params = "";

          if ($stateParams.urgencyCode != undefined && $stateParams.urgencyCode != null && $stateParams.urgencyCode != "") {
            params = "?urgencyCode=" + $stateParams.urgencyCode;
          }

          ActivitiesService.getActivities(params, onDone);

          function onDone (activities) {
            vm.elements = activities.data;

            for (var i = vm.elements.length - 1; i >= 0; i--) {
              vm.elements[i].id = extractId(vm.elements[i].hRef);
              vm.elements[i].event.id = extractId(vm.elements[i].event.hRef);
              vm.elements[i].event.practice.id = extractId(vm.elements[i].event.practice.hRef);

              if (vm.elements[i].description != undefined && vm.elements[i].description.length > 55) {
                vm.elements[i].shortDescription = vm.elements[i].description.substring(0,55);
              } else {
                vm.elements[i].shortDescription = '';
              }

              if (vm.elements[i].name != undefined && vm.elements[i].name.length > 30) {
                vm.elements[i].shortName = vm.elements[i].name.substring(0,30);
              } else {
                vm.elements[i].shortName = '';
              }
            }
          };

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function prepareDate(date) {
            return moment(date).format("ddd MMM DD YYYY HH:mm:ss") + " CEST";
          }

          vm.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withLanguageSource("//cdn.datatables.net/plug-ins/1.10.16/i18n/Italian.json")
            /*.withDOM('<"html5buttons"B>lTfgitp')
            .withButtons([
                {extend: 'copy',  className: 'btn-sm', text: 'Copia'},
                {extend: 'csv',   className: 'btn-sm'},
                {extend: 'print', className: 'btn-sm'}
            ])*/
            .withOption("info", false)
            .withOption("lengthChange", false)
            .withOption("paging", false);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withOption('width', '130px'),
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '150px'),
              DTColumnDefBuilder.newColumnDef(3).withOption('width', '230px')
          ];
        }
    }
})();
