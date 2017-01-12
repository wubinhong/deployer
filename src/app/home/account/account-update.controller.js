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
            $http.get('/backend/user/' + $stateParams.id).success(function(data) {
                vm.account = data.data;
                vm.roles = [{
                    display: '普通用户', value: 'NORMAL'
                }, {
                    display: '系统管理员', value: 'ADMIN'
                }];
            });

            // events
            vm.update = function() {
                if(vm.account.phone) {
                    vm.account.phone = vm.account.phone.replace(/-/g, '');
                }
                $http.put('/backend/user/' + vm.account.id, vm.account).success(function(data) {
                    if(data.code === 0) {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
