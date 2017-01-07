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
                // 设备添加页面
                .state('home.exception-detail', {
                    url: '/exception-detail?{id}{page:int}{count:int}',
                    templateUrl: 'app/home/exception/exception-detail.html',
                    controller: 'ExceptionDetailController',
                    controllerAs: 'exceptionDetailCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ExceptionDetailController', function($stateParams, $http, $scope, moment, NgTableParams, $document, growlService) {
            var vm = this;
            // back page param
            vm.page = $stateParams.page || 1;
            vm.count = $stateParams.count || 10;

            $http.get('/backend/admin/exception/device/' + $stateParams.id).then(function(response) {
                vm.exception = response.data.data;
                //Sorting
                vm.tableData = new NgTableParams({
                    page: 1,            // show first page
                    count: 10,           // count per page
                    sorting: {
                        time: 'desc'     // initial sorting
                    }
                }, {
                    counts: [10, 15, 20, 25],
                    getData: function(params) {
                        // use build-in angular filter
                        return $http.get('/backend/admin/exceptions', {
                            params: {
                                eqId: vm.exception.eqId,
                                start: moment($scope.dtPopup).format('YYYY-MM-DD'),
                                end: moment($scope.dtPopup2).format('YYYY-MM-DD'),
                                keyword: vm.keyword,
                                page: vm.page - 1, size: vm.count, sorting: params.orderBy()
                            }
                        }).then(function(res) {
                            params.total(res.data.data.total);
                            vm.data = res.data.data.content;
                            return vm.data;
                        });
                    }
                });
            });
            $http.get('/backend/admin/exception/device/{0}/stats'.format($stateParams.id)).then(function(response) {
                vm.stats = response.data.data;
            });

            // date picker
            $scope.dateOptions = {
                startingDay: 1
            };
            $scope.format = 'yyyy-MM-dd';
            $scope.dtPopup = moment().add(-7, 'days').toDate();
            $scope.dtPopup2 = new Date();
            $scope.minDate = $scope.minDate ? null : moment().add(-1, 'months').toDate();

            $scope.open = function($event, opened) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope[opened] = true;
            };

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
                    swal('警告', '请先勾选异常', 'warning');
                    return;
                }
                swal({
                    title: "确定批量删除勾选异常?",
                    text: "异常删除后将无法恢复!",
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: '取消',
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "删除",
                    closeOnConfirm: false
                }, function(){
                    $http.delete('/backend/admin/exception/' + ids.join(',')).then(function(response) {
                        if(response.data.status === 'success') {
                            swal("批量删除成功!", "勾选的异常已经全部被删除", "success");
                            vm.tableData.reload();
                            vm.allChecked = false;
                        }
                    });
                });

            };

            vm.handleBatch = function() {
                var ids = handleCheckItems();
                if(ids.length === 0) {
                    swal('警告', '请先勾选异常', 'warning');
                    return;
                }
                $http.patch('/backend/admin/exception/{0}/handle'.format(ids.join(','))).then(function(response) {
                    if(response.data.status === 'success') {
                        swal("批量标注成功!", "勾选的异常已经标注为已处理", "success");
                        vm.tableData.reload();
                    }
                });
            };

            vm.handle = function(row) {
                $http.patch('/backend/admin/exception/{0}/handle'.format(row.id)).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('标注成功');
                        vm.tableData.reload();
                    }
                });
            };
        });

})();
