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
                .state('home.account-add', {
                    url: '/account-add',
                    templateUrl: 'app/home/account/account-add.html',
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
            vm.account = {gender: 'MALE', userType: 'NORMAL', enable: false};
            vm.genders = [{
                display: '男', value: 'MALE'
            }, {
                display: '女', value: 'FEMALE'
            }];
            vm.userTypes = [{
                display: '普通用户', value: 'NORMAL'
            }, {
                display: '系统管理员', value: 'ADMIN'
            }];
            vm.enables = [{
                display: '启用', value: true
            }, {
                display: '禁止', value: false
            }];

            // events
            vm.add = function() {
                if(!vm.account) {
                    growlService.warning('请填写信息');
                    return;
                }
                if(vm.account.phoneNum) {
                    vm.account.phoneNum = vm.account.phoneNum.replace(/-/g, '');
                }
                $http.post('/backend/admin/users', vm.account).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('添加成功！');
                    }
                });
            }
        });

})();
