(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function ($stateProvider) {
            $stateProvider
                .state('home.devices-bind-accounts', {
                    url: '/devices-bind-accounts?{deviceGroupId}{page:int}{count:int}',
                    templateUrl: 'app/home/devices/devices-bind-accounts.html',
                    controller: 'DevicesBindAccountsController',
                    controllerAs: 'devicesBindAccountsCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('DevicesBindAccountsController', function ($stateParams, $http, growlService) {
            var groupId = $stateParams.deviceGroupId;
            var vm = this;

            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            function loadBindingData() {
                $http.get('/backend/admin/bind/device-group/{0}/user-group/unbound'.format(groupId), {
                    params: {
                        page: 0, size: 20
                    }
                }).then(function (response) {
                    if (response.data.status === 'success') {
                        vm.unbounds = response.data.data;
                    }
                });
                $http.get('/backend/admin/bind/device-group/{0}/user-group/bound'.format(groupId), {
                    params: {
                        page: 0, size: 20
                    }
                }).then(function (response) {
                    if (response.data.status === 'success') {
                        vm.bounds = response.data.data;
                    }
                });
            }

            // data init
            $http.get('/backend/admin/device/group/' + groupId).then(function (response) {
                vm.deviceGroup = response.data.data;
            });
            loadBindingData();

            // events
            vm.leftCheckAll = function () {
                vm.leftAllChecked = !vm.leftAllChecked;
                vm.unbounds.forEach(function (e) {
                    e.checked = vm.leftAllChecked;
                });
            };
            vm.rightCheckAll = function () {
                vm.rightAllChecked = !vm.rightAllChecked;
                vm.bounds.forEach(function (e) {
                    e.checked = vm.rightAllChecked;
                });
            };
            // 批量绑定
            vm.bindBatch = function () {
                var ids = [];
                vm.unbounds.forEach(function (e) {
                    if (e.checked) {
                        ids.push(e.id);
                    }
                });
                if (ids.length === 0) {
                    swal('警告', '请先勾选绑定用户组', 'warning');
                    return;
                }
                swal({
                    title: "确定绑定勾选用户组?",
                    text: "绑定用户组后，可以在右边将用户组解绑!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "绑定"
                }, function () {
                    $http.post('/backend/admin/bind/device-group/{0}/user-group/{1}'.format(groupId, ids.join(','))).then(function (response) {
                        if (response.data.status === 'success') {
                            growlService.success('批量绑定成功！');
                            loadBindingData();
                        }
                    });
                });
            };
            // 批量解绑
            vm.unbindBatch = function () {
                var ids = [];
                vm.bounds.forEach(function (e) {
                    if (e.checked) {
                        ids.push(e.id);
                    }
                });
                if (ids.length === 0) {
                    swal('警告', '请先勾选解绑用户组', 'warning');
                    return;
                }
                swal({
                    title: "确定解绑勾选用户组?",
                    text: "绑定用户组后，可以在左边重新绑定用户组!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "解绑"
                }, function () {
                    $http.delete('/backend/admin/bind/device-group/{0}/user-group/{1}'.format(groupId, ids.join(','))).then(function (response) {
                        if (response.data.status === 'success') {
                            growlService.success('批量解绑成功！');
                            loadBindingData();
                        }
                    });
                });
            };

        });

})();
