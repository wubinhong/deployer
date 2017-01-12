(function () {
    'use strict';

    angular
        .module('frontend')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($http, growlService, $document, $cookies) {
        //Status

        var vm = this;
        vm.login = 1;
        vm.register = 0;
        vm.forgot = 0;

        // event
        vm.loginModel = {};
        vm.doLogin = function() {
            $http.post('/backend/auth/login', vm.loginModel).then(function(response) {
                if(response.data.code === 0) {
                    $cookies.putObject('user', response.data.data);
                    growlService.success('登陆成功！');
                    location.href = '/';
                }
            });
        };

        // 全局键盘绑定事件
        $document.bind("keypress", function(event) {
            if(event.keyCode === 13) {  // 用户按下回车键
                if(vm.login) {    // 此时为登陆窗口时
                    vm.doLogin();
                } else if(vm.register) { // 注册
                    vm.doRegister();
                } else if(vm.forgot) { // 找回密码
                    vm.findPassword();
                }
            }
        });

    }
})();
