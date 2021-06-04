(function () {
    'use strict';

    angular
        .module('frontend')
        .filter('bytes', bytesFilter)
        .filter('myNumber', myNumberFilter)
        .filter('trustAsHtml', trustAsHtml)
        .filter('limitToCustom', limitToCustom)
    ;

    /**
     * convert bytes to be more readable as KB, MB, GB, and so on.
     * @returns {Function}
     */
    function bytesFilter() {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
    }

    function myNumberFilter($filter) {
        return function (number, fractionSize) {
            if (isNaN(parseFloat(number)) || !isFinite(number)) return '0';
            return $filter('number')(number, fractionSize);
        }
    }

    /**
     * trust the value as normal html
     * @param $sce
     * @returns {Function}
     */
    function trustAsHtml($sce) {
        return function (snippet) {
            return $sce.trustAsHtml(snippet);
        }
    }


    function limitToCustom() {
        return function (input, limit) {
            if (input) {
                if (limit > input.length) {
                    return input.slice(0, limit);
                } else {
                    return input.slice(0, limit) + '...';
                }
            }
        };
    }


})();
