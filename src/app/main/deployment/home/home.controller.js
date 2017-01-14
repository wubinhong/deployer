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
                .state('main.home', {
                    url: '/deployment/main?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'homeCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('HomeController', function(menuService) {
            // menu active
            menuService.activeMenu('main.home');

        })
    ;

})();
