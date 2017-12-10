/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS Material
 * 
 * Version: 3.8
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 * 
 */

// APP START
// ----------------------------------- 

(function() {
    'use strict';

    angular
        .module('angle', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.navsearch',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.maps',
            'app.utils',
            'app.pages',
            'app.tables',
            'app.material',
            'app.authentication',
            'app.welcome',
            'app.practices',
            'app.practice',
            'app.event',
            'app.activity',
            'app.user'
        ]);
})();

