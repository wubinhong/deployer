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
                .state('home.accounts-add', {
                    url: '/accounts-add',
                    templateUrl: 'app/home/accounts/accounts-add.html',
                    controller: 'AccountsAddController',
                    controllerAs: 'accountsAddCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountsAddController', function($http, growlService, $state) {
            var vm = this;

            // init

            // events
            vm.add = function() {
                if(!vm.account) {
                    growlService.warning('请填写基本信息');
                    return;
                }
                if(!vm.account.name) {
                    growlService.warning('组名必填');
                    return;
                }
                $http.post('/backend/admin/user/groups', vm.account).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('添加成功！');
                        $state.go('home.accounts');
                    }
                });
            }
        });

})();
