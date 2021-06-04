(function () {
    'use strict';

    angular
        .module('frontend')
        // =========================================================================
        // MALIHU SCROLL
        // =========================================================================

        //On Custom Class
        .directive('cOverflow', function(scrollService){
            return {
                restrict: 'C',
                link: function(scope, element) {

                    if (!angular.element('html').hasClass('ismobile')) {
                        scrollService.malihuScroll(element, 'minimal-dark', 'y');
                    }
                }
            }
        })

        // =========================================================================
        // WAVES
        // =========================================================================

        // For .btn classes
        .directive('btn', function(){
            return {
                restrict: 'C',
                link: function(scope, element) {
                    if(element.hasClass('btn-icon') || element.hasClass('btn-float')) {
                        Waves.attach(element, ['waves-circle']);
                    }

                    else if(element.hasClass('btn-light')) {
                        Waves.attach(element, ['waves-light']);
                    }

                    else {
                        Waves.attach(element);
                    }

                    Waves.init();
                }
            }
        });

})();

