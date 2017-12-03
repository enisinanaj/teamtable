(function() {
    'use strict';

    angular
        .module('app.settings')
        .run(settingsRun);

    settingsRun.$inject = ['$rootScope', '$state', '$localStorage', 'AuthenticationFactory'];

    function settingsRun($rootScope, $state, $localStorage, AuthenticationFactory) {
      // User Settings
      // -----------------------------------
      $rootScope.user = {
        picture:  'app/img/149071.png'
      };

      // Hides/show user avatar on sidebar from any element
      $rootScope.toggleUserBlock = function(){
        $rootScope.$broadcast('toggleUserBlock');
      };

      // Global Settings
      // -----------------------------------
      $rootScope.app = {
        name: 'TeamTable',
        description: 'Gestione del team in cloud',
        year: ((new Date()).getFullYear()),
        layout: {
          isFixed: true,
          isCollapsed: false,
          isBoxed: false,
          isRTL: false,
          horizontal: false,
          isFloat: false,
          asideHover: false,
          theme: "app/css/theme-b.css",
          asideScrollbar: false,
          isCollapsedText: false
        },
        apiUrl: 'http://localhost:8080/teamtable/api/',
        useFullLayout: false,
        hiddenFooter: false,
        offsidebarOpen: false,
        asideToggled: false,
        viewAnimation: 'ng-fadeInUp'
      };

      // Setup the layout mode
      $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout === 'app-h') ;

      // Close submenu when sidebar change from collapsed to normal
      $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
        if( newValue === false )
          $rootScope.$broadcast('closeSidebarMenu');
      });

    }

})();
