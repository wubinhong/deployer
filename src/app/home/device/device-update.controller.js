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
                .state('home.device-update', {
                    url: '/device-update?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/device/device-update.html',
                    controller: 'DeviceUpdateController',
                    controllerAs: 'deviceUpdateCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DeviceUpdateController', function($stateParams, $http, growlService) {
            var vm = this;
            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            // page data init
            $http.get('/backend/admin/device/' + $stateParams.id).then(function(response) {
                vm.device = response.data.data;
                // 协议combo box
                $http.get('/backend/admin/device/protocols', {
                    params: {
                        keyword: '', page: 0, size: 200, sorting: '+name'
                    }
                }).then(function(response) {
                    if(response.data.status === 'success') {
                        vm.protocols = [];
                        response.data.data.forEach(function(protocol) {
                            vm.protocols.push({
                                display: protocol.name, value: protocol.id
                            });
                        });
                    }
                });
            });

            // events
            vm.update = function() {
                $http.put('/backend/admin/device/' + vm.device.id, vm.device).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
