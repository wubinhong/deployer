/**
 * 枚举过滤器
 * Created by wubinhong on 27/11/16.
 */
(function() {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // deviceStatus
        // =========================================================================
        .service('menuService', function() {
            /**
             * active left side menus
             * @param state 菜单路由state
             */
            this.activeMenu = function(state) {
                var mainCtrl = angular.element('sidebar-left').controller();
                mainCtrl.leftMenus.forEach(function(menu) {
                    menu.active = false;
                    menu.subMenus.forEach(function(subMenu) {
                        subMenu.active = false;
                        if(subMenu.state == state) {
                            menu.active = true;
                            subMenu.active = true;
                        }
                    });
                });
            }
        })
    ;
})();