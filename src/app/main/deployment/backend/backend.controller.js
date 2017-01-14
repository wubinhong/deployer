/* eslint "angular/controller-as": 0 */
(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                // dashboard面板
                .state('main.backend', {
                    url: '/deployment/backend?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/backend/backend.html',
                    controller: 'BackendController',
                    controllerAs: 'backendCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('BackendController', function(menuService) {
            // menu active
            menuService.activeMenu('main.backend');

        })
    ;

})();
