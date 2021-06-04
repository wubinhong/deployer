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
                .state('main.backend', {
                    url: '/deployment/backend?{page:int}{count:int}',
                    templateUrl: 'app/main/deployment/backend/backend.html',
                    controller: 'BackendController',
                    controllerAs: 'backendCtrl'
                })
            ;
        })
        // =========================================================================
        // controller
        // =========================================================================
        .controller('BackendController', function(menuService, $http) {
            // menu active
            menuService.activeMenu('main.backend');
            var vm = this;
            // init
            vm.deploy = {profile: 'dev', host: 'dev.dandanlicai.com', branch: 'master', commit: 'abcd'};
            vm.profiles = [{
                display: 'dev环境', value: 'dev'
            }, {
                display: 'test环境', value: 'test'
            }, {
                display: 'prod环境', value: 'prod'
            }];
            vm.hosts = [{
                display: 'dev.dandanlicai.com', value: 'dev.dandanlicai.com'
            }, {
                display: 'test.dandanlicai.com', value: 'test.dandanlicai.com'
            }, {
                display: 'prod.dandanlicai.com', value: 'prod.dandanlicai.com'
            }];
            vm.branches = [{
                display: 'master', value: 'master'
            }, {
                display: 'dev', value: 'dev'
            }];
            vm.commits = [{
                display: 'abcd', value: 'abcd'
            }, {
                display: 'efgg', value: 'efgg'
            }];


            vm.services = [ {
                name: 'account-center'
            }, {
                name: 'admin-center'
            }, {
                name: 'message-center'
            }, {
                name: 'miss-center'
            }, {
                name: 'oss-center'
            }, {
                name: 'robot-center'
            }, {
                name: 'sns-center'
            }, {
                name: 'stat-center'
            }, {
                name: 'stock-center'
            }, {
                name: 'subscribe-center'
            }
            ];

            vm.apps = [{
                name: 'api-server'
            }, {
                name: 'admin-server'
            }, {
                name: 'standalone-server'
            }];


            // events
            vm.checkAllServices = function($event) {
                var checked = $event.target.checked;
                if(checked) {
                    $('input[name="service"]:not(:checked)').click();
                } else {
                    $('input[name="service"]:checked').click();
                }
            };

            vm.checkAllApps = function($event) {
                var checked = $event.target.checked;
                if(checked) {
                    $('input[name="app"]:not(:checked)').click();
                } else {
                    $('input[name="app"]:checked').click();
                }
            };


            vm.release = function() {
                // handle services
                vm.deploy.services = [];
                $('input[name="service"]:checked').each(function(idx, input) {
                    vm.deploy.services.push(input.value);
                });
                // handle apps
                vm.deploy.apps = [];
                $('input[name="app"]:checked').each(function(idx, input) {
                    vm.deploy.apps.push(input.value);
                });
                console.log(vm.deploy);
            };

            $http.get('/backend/deploy/profiles').success(function(res) {
                console.log(res);
            });

        })
    ;

})();
