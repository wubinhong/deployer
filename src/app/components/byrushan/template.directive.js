(function () {
    'use strict';

    angular
        .module('frontend')

        // =========================================================================
        // LAYOUT
        // =========================================================================

        .directive('changeLayout', function () {

            return {
                restrict: 'A',
                scope: {
                    changeLayout: '='
                },

                link: function (scope, element) {

                    //Default State
                    if (scope.changeLayout === '1') {
                        element.prop('checked', true);
                        angular.element('body').addClass('sw-toggled'); // fix up angular scope bug
                    }

                    //Change State
                    element.on('change', function () {
                        if (element.is(':checked')) {
                            localStorage.setItem('ma-layout-status', 1);
                            scope.$apply(function () {
                                scope.changeLayout = '1';
                            });
                            angular.element('body').addClass('sw-toggled'); // fix up angular scope bug
                        }
                        else {
                            localStorage.setItem('ma-layout-status', 0);
                            scope.$apply(function () {
                                scope.changeLayout = '0';
                            });
                            angular.element('body').removeClass('sw-toggled'); // fix up angular scope bug
                        }
                    })
                }
            }
        })


        // =========================================================================
        // MAINMENU COLLAPSE
        // =========================================================================

        .directive('toggleSidebar', function () {

            return {
                restrict: 'A',
                scope: {
                    modelLeft: '=',
                    modelRight: '='
                },

                link: function (scope, element) {
                    element.on('click', function () {

                        if (element.data('target') === 'mainmenu') {
                            if (scope.modelLeft === false) {
                                scope.$apply(function () {
                                    scope.modelLeft = true;
                                })
                            }
                            else {
                                scope.$apply(function () {
                                    scope.modelLeft = false;
                                })
                            }
                        }

                        if (element.data('target') === 'chat') {
                            if (scope.modelRight === false) {
                                scope.$apply(function () {
                                    scope.modelRight = true;
                                })
                            }
                            else {
                                scope.$apply(function () {
                                    scope.modelRight = false;
                                })
                            }

                        }
                    })
                }
            }

        })


        // =========================================================================
        // SUBMENU TOGGLE
        // =========================================================================

        .directive('toggleSubmenu', function () {

            return {
                restrict: 'A',
                link: function (scope, element) {
                    element.click(function () {
                        element.next().slideToggle(200);
                        element.parent().toggleClass('toggled');
                    });
                }
            }
        })


        // =========================================================================
        // STOP PROPAGATION
        // =========================================================================

        .directive('stopPropagate', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.stopPropagation();
                    });
                }
            }
        })

        .directive('aPrevent', function () {
            return {
                restrict: 'C',
                link: function (scope, element) {
                    element.on('click', function (event) {
                        event.preventDefault();
                    });
                }
            }
        })


        // =========================================================================
        // PRINT
        // =========================================================================

        .directive('print', function () {
            return {
                restrict: 'A',
                link: function (scope, element, $window) {
                    element.click(function () {
                        $window.print();
                    })
                }
            }
        });
})();

   