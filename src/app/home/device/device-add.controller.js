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
                .state('home.device-add', {
                    url: '/device-add',
                    templateUrl: 'app/home/device/device-add.html',
                    controller: 'DeviceAddController',
                    controllerAs: 'deviceAddCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DeviceAddController', function($http, growlService) {
            var vm = this;
            // init
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
                    // default protocol
                    vm.device = {protocolId: vm.protocols[0].value};
                }
            });
            // events
            vm.add = function() {
                $http.post('/backend/admin/devices', vm.device).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('添加成功！');
                    }
                });
            }
        });

})();
