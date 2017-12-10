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

        //defaults to
        $urlRouterProvider.otherwise('/app/welcome');


        $stateProvider
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
                templateUrl: 'app/pages/login.html',
                resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.register', {
                url: '/register',
                title: 'Register',
                templateUrl: 'app/pages/register.html',
                resolve: helper.resolveFor('modernizr', 'icons')
            })
            .state('page.recover', {
                url: '/recover',
                title: 'Recover',
                templateUrl: 'app/pages/recover.html',
                resolve: helper.resolveFor('modernizr', 'icons')
            })
          // 
          // Application Routes
          // -----------------------------------   
          .state('app', {
              url: '/app',
              abstract: true,
              templateUrl: helper.basepath('app.html')
          })
            .state('app.welcome', {
                url: '/welcome',
                title: 'Welcome',
                templateUrl: helper.basepath('welcome.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.add_practice', {
                url: '/addPractice/:practiceId',
                title: 'Add practice',
                templateUrl: helper.basepath('add_practice.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.add_event', {
                url: '/addEvent/:eventId/:practiceId',
                title: 'Add event',
                templateUrl: helper.basepath('add_event.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.add_activity', {
                url: '/addActivity/:activityId/:eventId',
                title: 'Add activity',
                templateUrl: helper.basepath('add_activity.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.single_practice', {
                url: '/practice/:practiceId',
                title: 'Single practice',
                templateUrl: helper.basepath('practice.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.practices_management', {
                url: '/practices',
                title: 'Practices',
                templateUrl: helper.basepath('practices.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.practices_management_urgency', {
                url: '/practices/urgency/:urgencyCode',
                title: 'Practices',
                templateUrl: helper.basepath('practices.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.practices_management_dates', {
                url: '/practices/dates/:fromDate/:toDate',
                title: 'Practices',
                templateUrl: helper.basepath('practices.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.practices_management_by_name', {
                url: '/practices/name/:name',
                title: 'Practices',
                templateUrl: helper.basepath('practices.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.single_event', {
                url: '/event/:eventId',
                title: 'Single event',
                templateUrl: helper.basepath('event.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.events', {
                url: '/events',
                title: 'Events',
                templateUrl: helper.basepath('events.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.single_activity', {
                url: '/activity/:activityId',
                title: 'Single activity',
                templateUrl: helper.basepath('activity.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            })
            .state('app.activities', {
                url: '/activities',
                title: 'Activities',
                templateUrl: helper.basepath('activities.html'),
                resolve: helper.resolveForAuthenticated('practices', 'moment', 'modernizr', 'icons')
            });

    } // routesConfig

})();

