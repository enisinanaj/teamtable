/**=========================================================
 * Module: datatable,js
 * Angular Datatable controller
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.practices')
        .controller('PracticesController', PracticesController);

    PracticesController.$inject = ['$scope', '$window', '$state', '$stateParams',
      '$resource', 'DTOptionsBuilder', 'DTColumnDefBuilder', 'PracticesService'];
    
    function PracticesController($scope, $window, $state, $stateParams,
      $resource, DTOptionsBuilder, DTColumnDefBuilder, PracticesService) {
        
        var vm = this;

        activate();

        function activate() {

          // Ajax

          var params = "";

          if ($stateParams.urgencyCode != undefined && $stateParams.urgencyCode != null && $stateParams.urgencyCode != "") {
            params = "?urgencyCode=" + $stateParams.urgencyCode;
          }

          if ($stateParams.fromDate != undefined && $stateParams.fromDate != null && $stateParams.fromDate != ""
            && $stateParams.toDate != undefined && $stateParams.toDate != null && $stateParams.toDate != "") {
            params = "?dateFrom=" + prepareDate($stateParams.fromDate) + "&dateTo=" + prepareDate($stateParams.toDate);
          }

          if ($stateParams.name != undefined && $stateParams.name != null && $stateParams.name != "") {
            params = "?name=" + $stateParams.name;
          }

          PracticesService.getPractices(params, onDone);

          function onDone (practices) {
            vm.elements = practices.data;

            for (var i = vm.elements.length - 1; i >= 0; i--) {
              vm.elements[i].id = extractId(vm.elements[i].hRef);
              vm.elements[i].redUrgency = false;
              vm.elements[i].yellowUrgency = false;
              vm.elements[i].greenUrgency = false;
              vm.elements[i].greyUrgency = false;

              if (vm.elements[i].urgencyCode == 'red') 
                vm.elements[i].redUrgency = true;
              if (vm.elements[i].urgencyCode == 'yellow')
                vm.elements[i].yellowUrgency = true;
              if (vm.elements[i].urgencyCode == 'green')
                vm.elements[i].greenUrgency = true;

              if ((!vm.elements[i].greenUrgency) && (!vm.elements[i].yellowUrgency) && (!vm.elements[i].redUrgency)) {
                vm.elements[i].greyUrgency = true;
              }
            }
          };

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          function prepareDate(date) {
            return moment(date).format("ddd MMM DD YYYY HH:mm:ss") + " CEST";
          }

          vm.showArchived = false;

          vm.dtInstance = {};

          $scope.reloadData = function() {
             vm.dtInstance._renderer.rerender();             
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
            .withOption("paging", false)
            .withOption('order', [0, 'asc']);

          vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(0).withOption('width', '200px'),
              DTColumnDefBuilder.newColumnDef(1),
              DTColumnDefBuilder.newColumnDef(2).withOption('width', '60px')
          ];
        }
    }
})();
