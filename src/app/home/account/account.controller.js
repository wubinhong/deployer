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
                .state('home.account', {
                    url: '/account?{page:int}{count:int}',
                    templateUrl: 'app/home/account/account.html',
                    controller: 'AccountController',
                    controllerAs: 'accountCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountController', function(menuService, $http, $stateParams, NgTableParams, $document, $window, growlService, $uibModal) {
            // menu active
            menuService.activeMenu('home.account');
            var vm = this;
            // stats
            $http.get('/backend/admin/user/stats').then(function(response) {
                if(response.data.status === 'success') {
                    vm.stats = response.data.data;
                }
            });
            //Sorting
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            vm.tableData = new NgTableParams({
                page: vm.page,            // show first page
                count: vm.count,           // count per page
                sorting: {
                    id: 'desc'     // initial sorting
                }
            }, {
                counts: [10, 15, 20, 25],
                getData: function(params) {
                    // use build-in angular filter
                    vm.page = params.page();
                    vm.count = params.count();
                    return $http.get('/backend/admin/users', {
                        params: {
                            keyword: vm.keyword, page: vm.page - 1, size: vm.count, sorting: params.orderBy()
                        }
                    }).then(function(res) {
                        params.total(res.data.data.total);
                        vm.data = res.data.data.content;
                        return vm.data;
                    });
                }
            });
            // 全局键盘绑定事件
            $document.off('keypress');
            $document.bind("keypress", function(event) {
                if(event.keyCode === 13) {  // 用户按下回车键
                    vm.tableData.reload();
                }
            });
            vm.checkAll = function() {
                vm.allChecked = !vm.allChecked;
                vm.data.forEach(function(e) {
                    e.checked = vm.allChecked;
                });
            };

            function handleCheckItems() {
                var ids = [];
                vm.data.forEach(function(e) {
                    if(e.checked) {
                        ids.push(e.id);
                    }
                });
                return ids;
            }

            vm.delBatch = function() {
                var ids = handleCheckItems();
                if(ids.length === 0) {
                    swal('警告', '请先勾选账号', 'warning');
                    return;
                }
                swal({
                    title: "确定批量删除勾选账号?",
                    text: "账号删除后将无法恢复!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false
                }, function(){
                    $http.delete('/backend/admin/user/' + ids.join(',')).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量删除成功!", "勾选的账号已经全部被删除", "success");
                            vm.tableData.reload();
                            vm.allChecked = false;
                        }
                    });
                });

            };

            vm.del = function(row) {
                swal({
                    title: "确定删除该账号?",
                    text: "账号删除后将无法恢复!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: true
                }, function(){
                    $http.delete('/backend/admin/user/' + row.id).then(function(response) {
                        if(response.data.status === 'success') {
                            growlService.success('删除成功');
                            vm.tableData.reload();
                        }
                    });
                });
            };

            vm.enable = function(row) {
                $http.patch('/backend/admin/user/{0}/enable?enable={1}'.format(row.id, row.enable)).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success(row.enable ? '启用成功' : '禁用成功');
                        vm.tableData.reload();
                    }
                });
            };

            vm.resetModal = function(row) { // 重置密码弹出框
                $uibModal.open({
                    animation: true,
                    templateUrl: 'resetModalContent.html',
                    controller: 'AccountModalController',
                    size: 300,
                    backdrop: true,
                    keyboard: true,
                    resolve: {
                        row: function () {
                            return row;
                        }
                    }
                });
            };

        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountModalController', function($scope, row, $uibModalInstance, $http, growlService) {
            console.log(row);

            $scope.reset = function () {
                $http.patch('/backend/admin/user/{0}/reset'.format(row.id), $scope.newPassword).then(function(res) {
                    if(res.data.status === 'success') {
                        growlService.success(res.data.message);
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
