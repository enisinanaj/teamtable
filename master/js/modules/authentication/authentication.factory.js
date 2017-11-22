(function() {

	angular.module("app.authentication")
		.factory('AuthenticationFactory', AuthenticationFactory);


	AuthenticationFactory.$inect = ["$q", "UserProfile"];

	function AuthenticationFactory($q, UserProfile) {

		var AuthenticationFactory = {

	   		OK: 200,

		    // "we don't know who you are, so we can't say if you're authorized to access
		    // this resource or not yet, please sign in first"
		    UNAUTHORIZED: 401,

		    // "we know who you are, and your profile does not allow you to access this resource"
		    FORBIDDEN: 403,

		    hasRole: function (role) {
		      return UserProfile.fetchUserProfile().then(function (userProfile) {
		        if (userProfile.$hasRole(role)) {
		          return AuthenticationFactory.OK;
		        } else if (userProfile.$isAnonymous()) {
		          return $q.reject(AuthenticationFactory.UNAUTHORIZED);
		        } else {
		          return $q.reject(AuthenticationFactory.FORBIDDEN);
		        }
		      });
		    },

		    hasAnyRole: function (roles) {
		      return UserProfile.fetchUserProfile().then(function (userProfile) {
		        if (userProfile.$hasAnyRole(roles)) {
		          return AuthenticationFactory.OK;
		        } else if (userProfile.$isAnonymous()) {
		          return $q.reject(AuthenticationFactory.UNAUTHORIZED);
		        } else {
		          return $q.reject(AuthenticationFactory.FORBIDDEN);
		        }
		      });
		    },

		    isAnonymous: function () {
		      return UserProfile.fetchUserProfile().then(function (userProfile) {
		        if (userProfile.$isAnonymous()) {
		          return AuthenticationFactory.OK;
		        } else {
		          return $q.reject(AuthenticationFactory.FORBIDDEN);
		        }
		      });
		    },

		    isAuthenticated: function () {
		      return UserProfile.fetchUserProfile().then(function (userProfile) {
		        if (userProfile.$isAuthenticated()) {
		          return AuthenticationFactory.OK;
		        } else {
		          return $q.reject(AuthenticationFactory.UNAUTHORIZED);
		        }
		      });
		    }

		  };

		  return AuthenticationFactory;

	}

})();