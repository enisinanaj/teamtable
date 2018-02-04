(function() {
  'use strict';

  angular.module('app.user', [])
      .controller('UserController', UserController);

  UserController.$inject = ['UserProfile', '$rootScope', '$http', '$cookies', '$window', 'AuthenticationService', 'AUTH', '$state'];

  function UserController(UserProfile, $rootScope, $http, $cookies, $window, AuthenticationService, AUTH, $state) {
    var vm = this;

    vm.oldPassword = "";
    vm.newPassword = "";
    vm.repeatPassword = "";
    vm.result = "";
    vm.resultStatus = "";

    activate();

    function activate() {
        vm.user = UserProfile.fetchUserProfile();

        vm.saveUser = saveUser;

        function saveUser() {
          var newPassword = CryptoJS.SHA256(vm.newPassword).toString();
          var oldPassword = CryptoJS.SHA256(vm.oldPassword).toString();
          var repeatPassword = CryptoJS.SHA256(vm.repeatPassword).toString();

          var config = {
              headers: {
                  'Content-Type': 'application/json;',
                  'token': AuthenticationService.generateToken(),
                  'apiKey': AUTH['api_key']
              },
              cache: false
          };

          if (vm.newPassword != vm.repeatPassword) {
            vm.result = 'Le due password sono diverse tra loro';
            vm.resultStatus = 'KO';
          } else {
            $http.post($rootScope.app.apiUrl + "users/" + $rootScope.user.id + "/passwords", {
              newPassword: newPassword,
              oldPassword: oldPassword,
              newPasswordRepeat: repeatPassword
            }, config)
              .then(function(response) {
                vm.result = 'Password cambiata correttamente!';
                vm.resultStatus = 'OK';
              }, function() {
                vm.result = 'Le password non sono corrette!';
                vm.resultStatus = 'KO';
            });
          }
        }
    }
  }
})();