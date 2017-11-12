/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/


(function() {
    'use strict';

    angular
        .module('app.routes')
        .config(routesConfig);

    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper){
        
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/app/welcome');

        // 
        // Application Routes
        // -----------------------------------   
        $stateProvider
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html'),
              resolve: helper.resolveFor('modernizr', 'icons')
          })
          .state('app.welcome', {
              url: '/welcome',
              title: 'Welcome',
              templateUrl: helper.basepath('welcome.html')
          })
          .state('app.add_practice', {
              url: '/addPractice',
              title: 'Add practice',
              templateUrl: helper.basepath('add_practice.html')
          })
          .state('app.add_event', {
              url: '/addEvent',
              title: 'Add event',
              templateUrl: helper.basepath('add_event.html')
          })
          .state('app.single_practice', {
              url: '/practice/:practiceId',
              title: 'Single practice',
              templateUrl: helper.basepath('practice.html'),
              resolve: helper.resolveFor('practices', 'moment')
          })
          .state('app.practices_management', {
              url: '/practices',
              title: 'Practices',
              templateUrl: helper.basepath('practices.html'),
              resolve: helper.resolveFor('practices')
          })
          .state('app.single_event', {
              url: '/event/:eventId',
              title: 'Single event',
              templateUrl: helper.basepath('event.html'),
              resolve: helper.resolveFor('practices')
          })
          .state('app.events', {
              url: '/events',
              title: 'Events',
              templateUrl: helper.basepath('events.html'),
              resolve: helper.resolveFor('practices')
          })
          //
          // Single Page Routes
          // -----------------------------------
          .state('page', {
              url: '/page',
              templateUrl: 'app/pages/page.html',
              resolve: helper.resolveFor('modernizr', 'icons'),
              controller: ['$rootScope', function($rootScope) {
                  $rootScope.app.layout.isBoxed = false;
              }]
          })
          .state('page.login', {
              url: '/login',
              title: 'Login',
              templateUrl: 'app/pages/login.html'
          })
          .state('page.register', {
              url: '/register',
              title: 'Register',
              templateUrl: 'app/pages/register.html'
          })
          .state('page.recover', {
              url: '/recover',
              title: 'Recover',
              templateUrl: 'app/pages/recover.html'
          })
          ;

    } // routesConfig

})();

