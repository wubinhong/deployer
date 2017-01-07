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
                .state('home.protocol-add', {
                    url: '/protocol-add',
                    templateUrl: 'app/home/protocol/protocol-add.html',
                    controller: 'ProtocolAddController',
                    controllerAs: 'protocolAddCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ProtocolAddController', function($http, growlService) {
            var vm = this;
            // events
            vm.add = function() {
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
                $http.post('/backend/admin/protocols', vm.protocol).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('添加成功！');
                    }
                });
            }
        });

})();
