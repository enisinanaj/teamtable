// Practices service
// angular.module("app").factory;


(function() {
    'use strict';

    angular
        .module('app.practices')
        .service('Practice', Practice);

    function Practice() {
    	var self = this;

    	this.getPractice = function() {
    		return self.currentPractice;
    	}

    	this.setPractice = function(practice) {
    		self.currentPractice = practice;
    	}
    }

})();