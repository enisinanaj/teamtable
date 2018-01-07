(function() {
    'use strict';

    angular
        .module('app.settings')
        .config(settingsConfig);

    settingsConfig.$inject = ['$mdDateLocaleProvider'];

    function settingsConfig($mdDateLocaleProvider) {
    	var vm = this;

        activate();

        ////////////////

        function activate() {
        	$mdDateLocaleProvider.formatDate = function(date) {
        		moment().locale('it');
		        var m = moment(date);
		        return m.isValid() ? m.format('DD/MM/YYYY') : '';
		    };

            $mdDateLocaleProvider.parseDate = function(dateString) {
                moment().locale('it');
                var m = moment(dateString, "DD/MM/YYYY");
                return m.isValid() ? m.toDate() : new Date(NaN);
            };
        };
    };

})();