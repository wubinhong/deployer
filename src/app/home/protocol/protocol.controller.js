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
                .state('home.protocol', {
                    url: '/protocol?{page:int}{count:int}',
                    templateUrl: 'app/home/protocol/protocol.html',
                    controller: 'ProtocolController',
                    controllerAs: 'protocolCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ProtocolController', function(menuService, $stateParams, $http, NgTableParams, $document, growlService) {
            // menu active
            menuService.activeMenu('home.protocol');
            var vm = this;
            // stats
            $http.get('/backend/admin/protocol/stats').then(function(response) {
                if(response.data.status === 'success') {
                    vm.stats = response.data.data;
                }
            });
            //Sorting
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;
            vm.tableData = new NgTableParams({
                page: 1,            // show first page
                count: 10,           // count per page
                sorting: {
                    id: 'asc'     // initial sorting
                }
            }, {
                counts: [10, 15, 20, 25],
                getData: function(params) {
                    // use build-in angular filter
                    vm.page = params.page();
                    vm.count = params.count();
                    return $http.get('/backend/admin/protocols', {
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
                    swal('警告', '请先勾选协议', 'warning');
                    return;
                }
                swal({
                    title: "确定批量删除勾选协议?",
                    text: "设备删除后将无法恢复!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false
                }, function(){
                    $http.delete('/backend/admin/protocol/' + ids.join(',')).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量删除成功!", "勾选的协议已经全部被删除", "success");
                            vm.tableData.reload();
                        }
                    });
                });

            };

            vm.del = function(row) {
                swal({
                    title: "确定删除该协议?",
                    text: "设备删除后将无法恢复!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: true
                }, function(){
                    $http.delete('/backend/admin/protocol/' + row.id).then(function(response) {
                        if(response.data.status === 'success') {
                            growlService.success('删除成功');
                            vm.tableData.reload();
                            vm.allChecked = false;
                        }
                    });
                });
            };

            vm.enable = function(row) {
                $http.patch('/backend/admin/protocol/{0}/enable?&enable={1}'.format(row.id, row.enable)).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('设置成功');
                        vm.tableData.reload();
                    }
                });
            };
        });

})();
