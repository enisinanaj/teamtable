(function() {

	angular.module("app.authentication")
		.service('UserProfile', UserProfile);

	UserProfile.$ineject =  ["AuthenticationService", '$rootScope'];

	function UserProfile(AuthenticationService, $rootScope) {
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
	      
	      angular.extend(vm.userProfile, response.data, {

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

	      function extractId(hRef) {
            if (hRef == undefined) {
              return "";
            }

            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

	      vm.userProfile.picture = 'app/img/149071.png';

	      $rootScope.user = vm.userProfile;
				$rootScope.user.id = extractId(vm.userProfile.hRef);
				$rootScope.user.sessionId = vm.userProfile.session != undefined ? vm.userProfile.session.sessionKey : undefined;

	      return $rootScope.user;
	    });
	  };
	}
  }	
)();