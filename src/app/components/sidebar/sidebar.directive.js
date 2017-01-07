(function () {
    'use strict';

    angular
        .module('frontend')
        .directive('sidebarLeft', sidebarLeft)
        .directive('sidebarRight', sidebarRight);

    /** @ngInject */
    function sidebarLeft() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/sidebar/sidebar-left.html',
            scope: {
                sidebarToggle: '=',
                menus: '='
            },
            controller: function($http, $cookies) {
                var vm = this;

                // 事件
                vm.sidebarStat = function (event, menu) {
                    // 如果点击了其他菜单，则隐藏菜单栏
                    if (!angular.element(event.target).parent().hasClass('active')) {
                        vm.sidebarToggle.left = false;
                    }
                    // active setting
                    vm.menus.forEach(function(item) {
                        delete item['active'];
                    });
                    menu.active = true;
                };
                vm.logout = function() {
                    $http.put('/backend/admin/auth/logout').then(function(response) {
                        if(response.data.status === 'success') {
                            $cookies.remove('user');
                            location.href = '/login.html';
                        }
                    });
                };

                // user info
                vm.user = $cookies.getObject('user');

            },
            controllerAs: 'vm',
            bindToController: true
        };
    }

    function sidebarRight() {
        return {
            restrict: 'E',
            templateUrl: 'app/components/sidebar/sidebar-right.html',
            scope: {
                menus: '=',
                sidebarToggle: '='
            },
            controller: function() {
//                var vm = this;
            },
            controllerAs: 'vm',
            bindToController: true
        };
    }

})();
