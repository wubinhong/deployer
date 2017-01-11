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
                if(response.data.status === 'success') {
                    $cookies.putObject('user', response.data.data);
                    growlService.success('登陆成功！');
                    location.href = '/';
                }
            });
        };

        vm.registerModel = {};
        vm.doRegister = function() {
            // validation
            if(!vm.registerModel.username) {
                growlService.warning('用户名不能为空');
            } else if(!vm.registerModel.password) {
                growlService.warning('密码不能为空');
            } else if(!vm.registerModel.email) {
                growlService.warning('邮箱不能为空');
            } else if(!vm.registerModel.agree) {
                growlService.warning('必须同意注册条款才能注册！');
            } else {
                $http.post('/backend/users', vm.registerModel).then(function(response) {
                    if(response.data.status === 'success') {
                        growlService.success('注册成功！');
                        location.href = '/login.html';
                    }
                });
            }
        };

        vm.findPassword = function() {
            // validation
            if(!vm.email) {
                growlService.warning('邮箱不能为空！');
                return;
            }
            // access backend api
            $http.patch('/backend/admin/auth/findPassword', {
                email: vm.email
            }).then(function(response) {
                if(response.data.status === 'success') {
                    growlService.success('密码重置链接已经发送至您的邮箱，请登陆邮箱重置密码！');
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
