/**
 * 枚举过滤器
 * Created by wubinhong on 27/11/16.
 */
(function() {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // deviceStatus
        // =========================================================================
        .filter('enumDeviceStatus', function() {
            return function(value) {
                if('ONLINE' === value) {
                    return '在线';
                } else if('OFFLINE' === value) {
                    return '离线';
                } else {
                    return '未注册';
                }
            };
        })
        // =========================================================================
        // gender
        // =========================================================================
        .filter('enumGender', function() {
            return function(value) {
                if('MALE' === value) {
                    return '男';
                } else {
                    return '女';
                }
            };
        })
    ;
})();