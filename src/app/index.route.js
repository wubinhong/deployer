(function () {
    'use strict';

    angular
        .module('frontend')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($urlRouterProvider, $locationProvider) {
        // 子模块的state定义在自己的controller里
        $urlRouterProvider.otherwise('/main/dashboard');
        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    }

})();
