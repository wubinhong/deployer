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
                .state('main.wechat', {
                    url: '/deployment/wechat?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/wechat/wechat.html',
                    controller: 'WeChatController',
                    controllerAs: 'wechatCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('WeChatController', function(menuService) {
            // menu active
            menuService.activeMenu('main.wechat');

        })
    ;

})();
