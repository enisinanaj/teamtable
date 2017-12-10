(function() {
    'use strict';

    angular
        .module('app.welcome')
        .controller('WelcomeController', WelcomeController);

     WelcomeController.$inject = ['$state'];

    function WelcomeController($state) {

    	var vm = this;

    	vm.practice = {
    		search: {
    			fromDate: new Date(),
    			toDate: new Date(),
                name: null
    		}
    	};

    	vm.doSearchPractices = doSearchPractices;

    	function doSearchPractices() {
    		$state.go('app.practices_management_dates', vm.practice.search);
    		return;
    	};

        vm.doSearchPracticesByName = doSearchPracticesByName;

        function doSearchPracticesByName() {
          $state.go('app.practices_management_by_name', vm.practice.search);
          return;  
        }
    }
})();