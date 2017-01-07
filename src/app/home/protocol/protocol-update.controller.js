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
                .state('home.protocol-update', {
                    url: '/protocol-update?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/protocol/protocol-update.html',
                    controller: 'ProtocolUpdateController',
                    controllerAs: 'protocolUpdateCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ProtocolUpdateController', function($stateParams, $http, growlService) {
            var vm = this;
            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;

            $http.get('/backend/admin/protocol/' + $stateParams.id).then(function(response) {
                vm.protocol = response.data.data;
            });

            // events
            vm.update = function() {
                if(!vm.protocol) {
                    growlService.warning('请填写基本信息');
                    return;
                }
                if(!vm.protocol.name) {
                    growlService.warning('协议名必填');
                    return;
                }
                if(!vm.protocol.detail) {
                    growlService.warning('协议内容必填');
                    return;
                }
                $http.put('/backend/admin/protocol/' + vm.protocol.id, vm.protocol).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
