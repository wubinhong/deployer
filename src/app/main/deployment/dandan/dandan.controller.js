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
                .state('main.dandan', {
                    url: '/deployment/dandan?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/dandan/dandan.html',
                    controller: 'DandanController',
                    controllerAs: 'dandandCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DandanController', function(menuService) {
            // menu active
            menuService.activeMenu('main.dandan');

        })
    ;

})();
