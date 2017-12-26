/**=========================================================
 * Module: access-login.js
 * Demo for login api
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.pages')
        .controller('LoginFormController', LoginFormController);

    LoginFormController.$inject = ['$http', '$state', '$window', 'AuthenticationService', '$rootScope', 'AUTH', '$cookies'];
    function LoginFormController($http, $state, $window, AuthenticationService, $rootScope, AUTH, $cookies) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
          // bind here all data from the form
          vm.account = {};
          // place the message if something goes wrong
          vm.authMsg = '';

          vm.extractId = extractId;

          function extractId(hRef) {
            return hRef.substring(hRef.lastIndexOf('/') + 1, hRef.length);
          }

          vm.login = function() {
            vm.authMsg = '';

            if(vm.loginForm.$valid) {
              var userPassword = CryptoJS.SHA256(vm.account.password).toString();
              $rootScope.user.password = userPassword;

              var config = {
                  headers: {
                      'Content-Type': 'application/json;',
                      'token': AuthenticationService.generateToken(),
                      'apiKey': AUTH['api_key'],
                      'principal': vm.account.user,
                      'principal-token': userPassword
                  },
                  cache: false
              };

              $http.post($rootScope.app.apiUrl + "sessions", {}, config)
                .then(function(response) {
                  $rootScope.user.authenticated = true;
                  $rootScope.user.anonymous = false;
                  $rootScope.user.id = vm.extractId(response.data.hRef);

                  if ( !response.data.hRef ) {
                    vm.authMsg = 'Incorrect credentials.';
                  }else{
                    $cookies.put('principal', response.data.session.sessionKey); //$rootScope.user.session.sessionId);
                    $window.location.href = $state.href('app.welcome');
                  }
                }, function() {
                  vm.authMsg = 'Credenziali non corrette!';
              });

            }
            else {
              // set as dirty if the user click directly to login so we show the validation messages
              /*jshint -W106*/
              vm.loginForm.account_email.$dirty = true;
              vm.loginForm.account_password.$dirty = true;
            }
          };
        }
    }
})();
