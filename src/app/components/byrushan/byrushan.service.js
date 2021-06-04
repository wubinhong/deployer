/**
 * Created by wubinhong on 22/10/16.
 */
(function () {
    'use strict';

    angular
        .module('frontend')

        .service('dataService', function dataService() {
            var data = [
                {
                    'title': 'AngularJS',
                    'url': 'https://angularjs.org/',
                    'description': 'HTML enhanced for web apps!',
                    'logo': 'angular.png'
                },
                {
                    'title': 'BrowserSync',
                    'url': 'http://browsersync.io/',
                    'description': 'Time-saving synchronised browser testing.',
                    'logo': 'browsersync.png'
                },
                {
                    'title': 'GulpJS',
                    'url': 'http://gulpjs.com/',
                    'description': 'The streaming build system.',
                    'logo': 'gulp.png'
                },
                {
                    'title': 'Jasmine',
                    'url': 'http://jasmine.github.io/',
                    'description': 'Behavior-Driven JavaScript.',
                    'logo': 'jasmine.png'
                },
                {
                    'title': 'Karma',
                    'url': 'http://karma-runner.github.io/',
                    'description': 'Spectacular Test Runner for JavaScript.',
                    'logo': 'karma.png'
                },
                {
                    'title': 'Protractor',
                    'url': 'https://github.com/angular/protractor',
                    'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
                    'logo': 'protractor.png'
                },
                {
                    'title': 'Sass (Ruby)',
                    'url': 'http://sass-lang.com/',
                    'description': 'Original Syntactically Awesome StyleSheets implemented in Ruby',
                    'logo': 'ruby-sass.png'
                }
            ];

            this.getSeeds = function () {
                return data;
            };
        })

        // =========================================================================
        // Malihu Scroll - Custom Scroll bars
        // =========================================================================
        .service('scrollService', function() {
            var ss = {};
            ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
                angular.element(selector).mCustomScrollbar({
                    theme: theme,
                    scrollInertia: 100,
                    axis:'yx',
                    mouseWheel: {
                        enable: true,
                        axis: mousewheelaxis,
                        preventDefault: true
                    }
                });
            };

            return ss;
        })


        //==============================================
        // BOOTSTRAP GROWL
        //==============================================

        .service('growlService', function(){
            var gs = {};
            gs.growl = function(message, type) {
                $.growl({
                    message: message
                },{
                    type: type,
                    allow_dismiss: false,
                    label: 'Cancel',
                    className: 'btn-xs btn-inverse',
                    placement: {
                        from: 'top',
                        align: 'right'
                    },
                    delay: 2500,
                    animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                    },
                    offset: {
                        x: 20,
                        y: 85
                    }
                });
            };
            // general notify
            function notify(message, title, icon, from, align, type, animIn, animOut) {
                $.growl({
                    icon: icon,
                    title: title,
                    message: message,
                    url: ''
                },{
                    element: 'body',
                    type: type,
                    allow_dismiss: true,
                    placement: {
                        from: from,
                        align: align
                    },
                    offset: {
                        x: 20,
                        y: 40
                    },
                    spacing: 10,
                    z_index: 1031,
                    delay: 2500,
                    timer: 1000,
                    url_target: '_blank',
                    mouse_over: false,
                    animate: {
                        enter: animIn,
                        exit: animOut
                    },
                    icon_type: 'class',
                    template: '<div data-growl="container" class="alert" role="alert">' +
                        '<button type="button" class="close" data-growl="dismiss">' +
                        '<span aria-hidden="true">&times;</span>' +
                        '<span class="sr-only">Close</span>' +
                        '</button>' +
                        '<span data-growl="icon"></span>' +
                        '<span data-growl="title"></span>' +
                        '<span data-growl="message"></span>' +
                        '<a href="#" data-growl="url"></a>' +
                        '</div>'
                });
            }

            gs.notify = notify;

            gs.info = function(message, title, icon) {
                notify(message, title, icon, undefined, undefined, 'info', undefined, undefined);
            };
            gs.success = function(message, title, icon) {
                notify(message, title, icon, undefined, undefined, 'success', undefined, undefined);
            };
            gs.warning = function(message, title, icon) {
                notify(message, title, icon, undefined, undefined, 'warning', undefined, undefined);
            };
            gs.danger = function(message, title, icon) {
                notify(message, title, icon, undefined, undefined, 'danger', undefined, undefined);
            };

            return gs;
        })
    ;

})();