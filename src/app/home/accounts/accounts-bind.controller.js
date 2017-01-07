(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // router
        // =========================================================================
        .config(function($stateProvider) {
            $stateProvider
                .state('home.accounts-bind', {
                    url: '/accounts-bind?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/accounts/accounts-bind.html',
                    controller: 'AccountsBindController',
                    controllerAs: 'accountsBindCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountsBindController', function($stateParams, $http, growlService) {
            var groupId = $stateParams.id;
            var vm = this;

            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            function loadBindingData() {
                $http.get('/backend/admin/user/group/{0}/unbound'.format(groupId), {
                    params: {
                        page: 0, size: 20
                    }
                }).then(function(response) {
                    if(response.data.status === 'success') {
                        vm.unbounds = response.data.data;
                    }
                });
                $http.get('/backend/admin/user/group/{0}/bound'.format(groupId), {
                    params: {
                        page: 0, size: 20
                    }
                }).then(function(response) {
                    if(response.data.status === 'success') {
                        vm.bounds = response.data.data;
                        vm.bounds.forEach(function(bound) {
                            bound.isAdmin = bound.bindType === 'ADMIN';
                        });
                    }
                });
            }

            // data init
            $http.get('/backend/admin/user/group/' + groupId).then(function(response) {
                vm.accountGroup = response.data.data;
            });
            loadBindingData();

            // events
            vm.leftCheckAll = function() {
                vm.leftAllChecked = !vm.leftAllChecked;
                vm.unbounds.forEach(function(e) {
                    e.checked = vm.leftAllChecked;
                });
            };
            vm.rightCheckAll = function() {
                vm.rightAllChecked = !vm.rightAllChecked;
                vm.bounds.forEach(function(e) {
                    e.checked = vm.rightAllChecked;
                });
            };
            // 批量绑定
            vm.bindBatch = function() {
                var ids = [];
                vm.unbounds.forEach(function(e) {
                    if(e.checked) {
                        ids.push(e.userId);
                    }
                });
                if(ids.length === 0) {
                    swal('警告', '请先勾选绑定用户', 'warning');
                    return;
                }
                swal({
                    title: "确定绑定勾选用户组?",
                    text: "绑定用户后，可以在右边将用户解绑!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "绑定",
                    closeOnConfirm: false
                }, function(){
                    $http.post('/backend/admin/user/group/{0}/bind/{1}'.format(groupId, ids.join(','))).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量绑定成功!", "勾选的用户已经全部被绑定", "success");
                            loadBindingData();
                        }
                    });
                });
            };
            // 批量解绑
            vm.unbindBatch = function() {
                var ids = [];
                vm.bounds.forEach(function(e) {
                    if(e.checked) {
                        ids.push(e.userId);
                    }
                });
                if(ids.length === 0) {
                    swal('警告', '请先勾选解绑用户', 'warning');
                    return;
                }
                swal({
                    title: "确定解绑勾选用户组?",
                    text: "绑定用户后，可以在左边重新绑定用户!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "解绑",
                    closeOnConfirm: false
                }, function(){
                    $http.delete('/backend/admin/user/group/{0}/unbind/{1}'.format(groupId, ids.join(','))).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量解绑成功!", "勾选的用户已经全部解绑", "success");
                            loadBindingData();
                        }
                    });
                });
            };
            // 设置是否为组管理员
            vm.changeBindType = function(bound) {
                var bindType = bound.bindType == 'ADMIN' ? 'NORMAL' : 'ADMIN';
                $http.patch('/backend/admin/user/group/bind-type', {
                    groupId: groupId, userIds: [bound.userId], bindType: bindType
                }).then(function(response) {
                    if(response.data.status === 'success') {
                        swal("批量解绑成功!", "勾选的用户已经全部解绑", "success");
                        growlService.success(response.data.message);
                        loadBindingData();
                    }
                });
            }

        });

})();
