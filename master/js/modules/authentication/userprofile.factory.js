(function() {

	angular.module("app.authentication")
		.factory('UserProfile', UserProfile);

	UserProfile.$ineject =  ["AuthenticationService"];

	function UserProfile(AuthenticationService) {
	  var userProfile = {};

	  var clearUserProfile = function () {
	    for (var prop in userProfile) {
	      if (userProfile.hasOwnProperty(prop)) {
	        delete userProfile[prop];
	      }
	    }
	  };

	  var fetchUserProfile = function () {
	    return AuthenticationService.getProfile().then(function (response) {
	      clearUserProfile();
	      
	      return angular.extend(userProfile, response.data, {

	        $refresh: fetchUserProfile,

	        $hasRole: function (role) {
	          return userProfile.roles.indexOf(role) >= 0;
	        },

	        $hasAnyRole: function (roles) {
	          return !!userProfile.roles.filter(function (role) {
	            return roles.indexOf(role) >= 0;
	          }).length;
	        },

	        $isAnonymous: function () {
	          return userProfile.anonymous == undefined ? true : userProfile.anonymous;
	        },

	        $isAuthenticated: function () {
	          return !userProfile.$isAnonymous();
	        }

	      });
	    });
	  };

	  return fetchUserProfile();
	}
  }	
)();