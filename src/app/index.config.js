(function () {
    'use strict';

    angular
        .module('frontend')
        .config(config);

    /** @ngInject */
    function config($logProvider, $httpProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // 配置http拦截器
        $httpProvider.interceptors.push(function ($q, growlService, $cookies) {

            function staticRes(url) {
                return new RegExp('^.*\\.(js|css|scss|gif|jpg|jpeg|tiff|png|woff|woff2)$').test(url);
            }
            function freeUrl(url) {
                return new RegExp('^.*(login.html)$').test(url) || new RegExp('^/backend/auth/.*$').test(url);
            }

            return {
                'request': function (config) {
                    // same as above
                    var url = config.url;
                    var user = $cookies.getObject('user');
                    if(!user && !staticRes(url) && !freeUrl(url)) {
                        location.href = '/login.html';
                    }
                    // 请求头设置（需要授权的api请求才需要加token请求头）
                    config.headers['x-dandan-client'] = '{"role":"ADVISER","version":"v1.1.1","deviceId":"1234fads"}';
                    if(user && !staticRes(url)) {
                        config.headers['x-dandan-token'] = user.token;
                    }
                    return config;
                },

                'response': function (response) {
                    // 拦截接口错误
                    if (new RegExp("^/backend").test(response.config.url) && response.data.code != 0) {
                        if(response.data.code === 14000) {   // 用户未登录
                            location.href = '/login.html';
                        } else {
                            growlService.warning(response.data.msg);
                        }
                    }
                    return response;
                },

                'responseError': function(rejection) {
//                    growlService.danger(rejection.statusText);
                    console.log('rejection', rejection);
                    if(angular.isObject(rejection.data)) {
                        growlService.danger(rejection.data.msg);
                    } else {
                        growlService.danger(rejection.data);
                    }
                    return $q.reject(rejection);
                }
            };
        });
    }

})();
