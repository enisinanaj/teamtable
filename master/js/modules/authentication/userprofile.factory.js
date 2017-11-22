(function() {

	angular.module("app.authentication")
		.service('UserProfile', UserProfile);

	UserProfile.$ineject =  ["AuthenticationService"];

	function UserProfile(AuthenticationService) {
	  var vm = this;
	  vm.userProfile = {};

	  vm.clearUserProfile = function () {
	    for (var prop in vm.userProfile) {
	      if (vm.userProfile.hasOwnProperty(prop)) {
	        delete vm.userProfile[prop];
	      }
	    }
	  };

	  vm.fetchUserProfile = function () {
	    return AuthenticationService.getProfile().then(function (response) {
	      vm.clearUserProfile();
	      
	      return angular.extend(vm.userProfile, response.data, {

	        $refresh: vm.fetchUserProfile,

	        $hasRole: function (role) {
	          return vm.userProfile.roles.indexOf(role) >= 0;
	        },

	        $hasAnyRole: function (roles) {
	          return !!vm.userProfile.roles.filter(function (role) {
	            return roles.indexOf(role) >= 0;
	          }).length;
	        },

	        $isAnonymous: function () {
	          return vm.userProfile.anonymous == undefined ? true : vm.userProfile.anonymous;
	        },

	        $isAuthenticated: function () {
	          return !vm.userProfile.$isAnonymous();
	        }

	      });
	    });
	  };
	}
  }	
)();