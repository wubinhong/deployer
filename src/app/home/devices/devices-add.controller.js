(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                // 设备添加页面
                .state('home.devices-add', {
                    url: '/devices-add',
                    templateUrl: 'app/home/devices/devices-add.html',
                    controller: 'DevicesAddController',
                    controllerAs: 'devicesAddCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DevicesAddController', function($http, growlService, $state) {
            var vm = this;

            // init

            // events
            vm.add = function() {
                if(!vm.device) {
                    growlService.warning('请填写基本信息');
                    return;
                }
                if(!vm.device.name) {
                    growlService.warning('组名必填');
                    return;
                }
                $http.post('/backend/admin/device/groups', vm.device).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('添加成功！');
                        $state.go('home.devices');
                    }
                });
            }
        });

})();
