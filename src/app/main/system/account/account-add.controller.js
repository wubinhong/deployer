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
                .state('main.account-add', {
                    url: '/system/account-add',
                    templateUrl: 'app/main/system/account/account-add.html',
                    controller: 'AccountAddController',
                    controllerAs: 'accountAddCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountAddController', function($http, growlService) {
            var vm = this;

            // init
            vm.account = {role: 'NORMAL'};
            vm.roles = [{
                display: '普通用户', value: 'NORMAL'
            }, {
                display: '系统管理员', value: 'ADMIN'
            }];

            // events
            vm.add = function() {
                if(!vm.account) {
                    growlService.warning('请填写信息！');
                    return;
                }
                if(!vm.account.name) {
                    growlService.warning('账号名称必填！');
                    return;
                }
                if(!vm.account.password) {
                    growlService.warning('密码必填！');
                    return;
                }
                if(vm.account.phone) {
                    vm.account.phone = vm.account.phone.replace(/-/g, '');
                }
                $http.post('/backend/users', vm.account).success(function(data) {
                    if(data.code === 0) {
                        growlService.success('添加成功！');
                    }
                });
            }
        });

})();
