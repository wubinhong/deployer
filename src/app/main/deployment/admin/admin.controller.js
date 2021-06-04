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
                .state('main.admin', {
                    url: '/deployment/admin?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/admin/admin.html',
                    controller: 'AdminController',
                    controllerAs: 'adminCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AdminController', function(menuService) {
            // menu active
            menuService.activeMenu('main.admin');

        })
    ;

})();
