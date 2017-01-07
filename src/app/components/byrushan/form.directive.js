(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // INPUT FEILDS MODIFICATION
        // =========================================================================

        //Add blue animated border and remove with condition when focus and blur

        .directive('fgLine', function(){
            return {
                restrict: 'C',
                link: function() {
                    if(angular.element('.fg-line')[0]) {
                        angular.element('body').on('focus', '.form-control', function(){
                            angular.element(this).closest('.fg-line').addClass('fg-toggled');
                        });

                        angular.element('body').on('blur', '.form-control', function(){
                            var p = angular.element(this).closest('.form-group');
                            var i = p.find('.form-control').val();

                            if (p.hasClass('fg-float')) {
                                if (i.length == 0) {
                                    angular.element(this).closest('.fg-line').removeClass('fg-toggled');
                                }
                            }
                            else {
                                angular.element(this).closest('.fg-line').removeClass('fg-toggled');
                            }
                        });
                    }

                }
            }

        })



        // =========================================================================
        // AUTO SIZE TEXTAREA
        // =========================================================================

        .directive('autoSize', function(){
            return {
                restrict: 'A',
                link: function(scope, element){
                    if (element[0]) {
                        autosize(element);
                    }
                }
            }
        })


        // =========================================================================
        // BOOTSTRAP SELECT
        // =========================================================================

        .directive('selectPicker', function(){
            return {
                restrict: 'A',
                link: function(scope, element) {
                    //if (element[0]) {
                    element.selectpicker();
                    //}
                }
            }
        })


        // =========================================================================
        // INPUT MASK
        // =========================================================================

        .directive('inputMask', function(){
            return {
                restrict: 'A',
                scope: {
                    inputMask: '='
                },
                link: function(scope, element){
                    element.mask(scope.inputMask.mask);
                }
            }
        })


        // =========================================================================
        // COLOR PICKER
        // =========================================================================

        .directive('colordPicker', function(){
            return {
                restrict: 'A',
                link: function(scope, element) {
                    angular.element(element).each(function(){
                        var colorOutput = angular.element(this).closest('.cp-container').find('.cp-value');
                        angular.element(this).farbtastic(colorOutput);
                    });

                }
            }
        })


        // =========================================================================
        // PLACEHOLDER FOR IE 9 (on .form-control class)
        // =========================================================================

        .directive('formControl', function(){
            return {
                restrict: 'C',
                link: function() {
                    if(angular.element('html').hasClass('ie9')) {
                        angular.element('input, textarea').placeholder({
                            customClass: 'ie9-placeholder'
                        });
                    }
                }

            }
        });

})();

