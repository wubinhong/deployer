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
                .state('home.exception', {
                    url: '/exception?{page:int}{count:int}',
                    templateUrl: 'app/home/exception/exception.html',
                    controller: 'ExceptionController',
                    controllerAs: 'exceptionCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('ExceptionController', function(menuService, $stateParams, $scope, moment, $http, NgTableParams, $document) {
            var vm = this;
            // menu active
            menuService.activeMenu('home.exception');
            // stats
            $http.get('/backend/admin/exception/stats').then(function(response) {
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
                    lastAt: 'desc'     // initial sorting
                }
            }, {
                counts: [10, 15, 20, 25],
                getData: function(params) {
                    // use build-in angular filter
                    vm.page = params.page();
                    vm.count = params.count();
                    return $http.get('/backend/admin/exception/devices', {
                        params: {
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

        });

})();
