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
                .state('home.accounts', {
                    url: '/accounts?{page:int}{count:int}',
                    templateUrl: 'app/home/accounts/accounts.html',
                    controller: 'AccountsController',
                    controllerAs: 'accountsCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('AccountsController', function(menuService, $stateParams, $http, NgTableParams, $document, growlService) {
            // menu active
            menuService.activeMenu('home.accounts');
            var vm = this;
            // stats
            $http.get('/backend/admin/user/group/stats').then(function(response) {
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
                    return $http.get('/backend/admin/user/groups', {
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
            vm.delBatch = function() {
                var ids = [];
                vm.data.forEach(function(e) {
                    if(e.checked) {
                        ids.push(e.id);
                    }
                });
                if(ids.length === 0) {
                    swal('警告', '请先勾选用户组', 'warning');
                    return;
                }
                swal({
                    title: "确定批量删除勾选用户组?",
                    text: "删除用户组将会删除用户组的所有绑定关系!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false
                }, function(){
                    $http.delete('/backend/admin/user/group/' + ids.join(',')).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量删除成功!", "勾选的协议已经全部被删除", "success");
                            vm.tableData.reload();
                            vm.allChecked = false;
                        }
                    });
                });

            };

            vm.del = function(row) {
                console.log(row);
                swal({
                    title: "确定删除该用户组?",
                    text: "删除用户组将会删除用户组的所有绑定关系!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: true
                }, function(){
                    $http.delete('/backend/admin/user/group/' + row.id).then(function(response) {
                        if(response.data.status === 'success') {
                            growlService.success('删除成功');
                            vm.tableData.reload();
                        }
                    });
                });
            };

        });

})();
