(function () {
    'use strict';

    angular
        .module('frontend')
        .config(routerConfig)
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function routerConfig($stateProvider) {
        $stateProvider
            // dashboard面板
            .state('main.dashboard', {
                url: '/dashboard',
                templateUrl: 'app/main/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dashboardCtrl'
            })
        ;

    }

    /** @ngInject */
    function DashboardController(menuService, $cookies) {
        // menu active
        menuService.activeMenu('main.dashboard');
        var vm = this;

        // data init
//        $http.get('/backend/admin/dashboard/stats').then(function(res) {
//            vm.stats = res.data.data;
//        });
        var user = $cookies.getObject('user');
        vm.isAdmin = user.userType === 'ADMIN';
        vm.isGroupAdmin = user.isGroupAdmin;
    }
})();
