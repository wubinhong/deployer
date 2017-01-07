(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                .state('home.account-update', {
                    url: '/account-update?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/account/account-update.html',
                    controller: 'AccountUpdateController',
                    controllerAs: 'accountUpdateCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountUpdateController', function($stateParams, $http, growlService) {
            var vm = this;
            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            // page data init
            $http.get('/backend/admin/user/' + $stateParams.id).then(function(response) {
                vm.account = response.data.data;
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
            });

            // events
            vm.update = function() {
                if(vm.account.phoneNum) {
                    vm.account.phoneNum = vm.account.phoneNum.replace(/-/g, '');
                }
                $http.put('/backend/admin/user/' + vm.account.id, vm.account).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
