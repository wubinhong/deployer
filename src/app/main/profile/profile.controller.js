/* eslint "angular/controller-as": 0 */
(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                // dashboard面板
                .state('main.profile', {
                    url: '/profile',
                    templateUrl: 'app/main/profile/profile.html',
                    controller: 'ProfileController',
                    controllerAs: 'profileCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ProfileController', function($cookies, $http, $uibModal, growlService, $state) {
            var vm = this;

            // page init
            $http.get('/backend/user/' + $cookies.getObject('user').id).success(function(res) {
                vm.user = res.data;
                console.log(vm.user);
            });
            vm.editInfo = 0;
            vm.genders = [{
                display: '男', value: 'MALE'
            }, {
                display: '女', value: 'FEMALE'
            }];

            vm.showModal = function() { // 重置密码弹出框
                $uibModal.open({
                    animation: true,
                    templateUrl: 'profile/resetModalContent.html',
                    controller: 'ProfileModalController',
                    size: 300,
                    backdrop: true,
                    keyboard: true
                });
            };

            // events
            vm.submit = function() {
                vm.user.password = '123';   //  避免不能更新
                $http.put('/backend/user/me', vm.user).success(function(res) {
                    if(res.code === 0) {
                        growlService.success(res.msg);
                        vm.editInfo = 0;
                    }
                });
            };
            vm.cancel = function() {
                vm.editInfo = 0;
                $state.reload();
            }

        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ProfileModalController', function($scope, $uibModalInstance, $http, growlService) {

            $scope.reset = function () {
                $http.patch('/backend/user/me/password', $scope.password).success(function(res) {
                    if(res.code === 0) {
                        growlService.success(res.msg);
                    }
                    $uibModalInstance.close();
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        })
    ;
})();
