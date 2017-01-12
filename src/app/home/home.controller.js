(function () {
    'use strict';

    angular
        .module('frontend')

        // =========================================================================
        // router
        // =========================================================================
        .config(function routerConfig($stateProvider) {
            $stateProvider
                // 首页
                .state('home', {
//                    abstract: true,
                    url: '/home',
                    templateUrl: 'app/home/home.html',
                    resolve: {
                        loadPlugin: function($ocLazyLoad) {
                            return $ocLazyLoad.load ([
                                {
                                    name: 'css',
                                    insertBefore: '#app-level',
                                    files: [
                                        'assets/vendors/bower_components/fullcalendar/dist/fullcalendar.min.css'
                                    ]
                                },
                                {
                                    name: 'vendors',
                                    insertBefore: '#app-level-js',
                                    files: [
                                        'assets/vendors/sparklines/jquery.sparkline.min.js',
                                        'assets/vendors/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                                        'assets/vendors/bower_components/simpleWeather/jquery.simpleWeather.min.js'
                                    ]
                                }
                            ])
                        }
                    },
                    controller: 'HomeController',
                    controllerAs: 'homeCtrl'
                })
            ;
        })

        // =========================================================================
        // Home
        // =========================================================================
        .controller('HomeController', function ($timeout, $state, $scope, growlService, $cookies) {

            var vm = this;

            //Welcome Message
            growlService.growl('欢迎使用吉林消防终端后台管理系统！', 'inverse');

            // Detact Mobile Browser
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                angular.element('html').addClass('ismobile');
            }

            // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
            vm.sidebarToggle = {
                left: false,
                right: false
            };

            // By default template has a boxed layout
            vm.layoutType = localStorage.getItem('ma-layout-status');

            // For Mainmenu Active Class
            vm.$state = $state;

            //Close sidebar on click
            vm.sidebarStat = function (event) {
                if (!angular.element(event.target).parent().hasClass('active')) {
                    vm.sidebarToggle.left = false;
                }
            };

            //Listview Search (Check listview pages)
            vm.listviewSearchStat = false;

            vm.lvSearch = function () {
                vm.listviewSearchStat = true;
            };

            //Listview menu toggle in small screens
            vm.lvMenuStat = false;

            //Blog
            vm.wallCommenting = [];

            vm.wallImage = false;
            vm.wallVideo = false;
            vm.wallLink = false;

            //Skin Switch
            vm.currentSkin = 'blue';

            vm.skinList = [
                'lightblue',
                'bluegray',
                'cyan',
                'teal',
                'green',
                'orange',
                'blue',
                'purple'
            ];

            vm.skinSwitch = function (color) {
                vm.currentSkin = color;
            };

            // user info
            vm.user = $cookies.getObject('user');
            var isAdmin = vm.user.role === 'ADMIN';
            // 初始化菜单
            vm.leftMenus = [{
                caption: '概况', iconClass: 'zmdi-home', state: 'home.dashboard', show: true, active: true
            }, {
                caption: '设备管理', iconClass: 'zmdi-devices', state: 'home.device', show: true
            }, {
                caption: '设备组管理', iconClass: 'zmdi-device-hub', state: 'home.devices', show: isAdmin
            }, {
                caption: '用户管理', iconClass: 'zmdi-account', state: 'home.account', show: isAdmin
            }, {
                caption: '用户组管理', iconClass: 'zmdi-accounts', state: 'home.accounts', show: isAdmin
            }, {
                caption: '协议管理', iconClass: 'zmdi-toys', state: 'home.protocol', show: isAdmin
            }, {
                caption: '异常管理', iconClass: 'zmdi-devices', state: 'home.exception', show: true
            }];

            // supply cookie user info
            vm.isAdmin = isAdmin;
        })
        // =========================================================================
        // Header
        // =========================================================================
        .controller('HeaderController', function ($timeout, $document) {

            var vm = this;
            // Top Search
            vm.openSearch = function () {
                angular.element('#header').addClass('search-toggled');
                angular.element('#top-search-wrap').find('input').focus();
            };

            vm.closeSearch = function () {
                angular.element('#header').removeClass('search-toggled');
            };

            // Get messages and notification for header
            vm.img = "1.jpg";
            vm.user = "David Belle";
            vm.text = "Cum sociis natoque penatibus et magnis dis parturient montes";

//            vm.messageResult = function() {};

            //Clear Notification
            vm.clearNotification = function ($event) {
                $event.preventDefault();

                var x = angular.element($event.target).closest('.listview');
                var y = x.find('.lv-item');
                var z = y.size();

                angular.element($event.target).parent().fadeOut();

                x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
                x.find('.grid-loading').fadeIn(1500);
                var w = 0;

                y.each(function () {
                    var z = angular.element(vm);
                    $timeout(function () {
                        z.addClass('animated fadeOutRightBig').delay(1000).queue(function () {
                            z.remove();
                        });
                    }, w += 150);
                });

                $timeout(function () {
                    angular.element('#notifications').addClass('empty');
                }, (z * 150) + 200);
            };

            // Clear Local Storage
            vm.clearLocalStorage = function () {

                //Get confirmation, if confirmed clear the localStorage
                swal({
                    title: "Are you sure?",
                    text: "All your saved localStorage values will be removed",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#F44336",
                    confirmButtonText: "Yes, delete it!",
                    closeOnConfirm: false
                }, function () {
                    localStorage.clear();
                    swal("Done!", "localStorage is cleared", "success");
                });

            };

            //Fullscreen View
            vm.fullScreen = function () {
                //Launch
                function launchIntoFullscreen(element) {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    }
                }

                //Exit
                function exitFullscreen() {
                    if ($document.exitFullscreen) {
                        $document.exitFullscreen();
                    } else if ($document.mozCancelFullScreen) {
                        $document.mozCancelFullScreen();
                    } else if ($document.webkitExitFullscreen) {
                        $document.webkitExitFullscreen();
                    }
                }

                if (exitFullscreen()) {
                    launchIntoFullscreen($document.documentElement);
                }
                else {
                    launchIntoFullscreen($document.documentElement);
                }
            }

        })
    ;

})();
