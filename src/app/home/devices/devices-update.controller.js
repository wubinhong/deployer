(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                .state('home.devices-update', {
                    url: '/devices-update?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/devices/devices-update.html',
                    controller: 'DevicesUpdateController',
                    controllerAs: 'devicesUpdateCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DevicesUpdateController', function($stateParams, $http, growlService) {
            var vm = this;

            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;

            $http.get('/backend/admin/device/group/' + $stateParams.id).then(function(response) {
                vm.devices = response.data.data;
            });

            // events
            vm.update = function() {
                if(!vm.devices.name) {
                    growlService.warning('设备组组名必填！');
                    return;
                }
                $http.put('/backend/admin/device/group/' + vm.devices.id, vm.devices).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
