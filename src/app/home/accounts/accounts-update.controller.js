(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                .state('home.accounts-update', {
                    url: '/accounts-update?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/accounts/accounts-update.html',
                    controller: 'AccountsUpdateController',
                    controllerAs: 'accountsUpdateCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountsUpdateController', function($stateParams, $http, growlService) {
            var vm = this;
            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;

            $http.get('/backend/admin/user/group/' + $stateParams.id).then(function(response) {
                vm.accounts = response.data.data;
            });

            // events
            vm.update = function() {
                if(!vm.accounts.name) {
                    growlService.warning('用户组组名必填！');
                    return;
                }
                $http.put('/backend/admin/user/group/' + vm.accounts.id, vm.accounts).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('更新成功！');
                    }
                });
            }
        });

})();
