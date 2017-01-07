(function () {
    'use strict';

    angular
        .module('frontend')
        .directive('byrushan', function () {
            var directive = {
                restrict: 'E',
                templateUrl: 'app/components/byrushan/byrushan.html',
                scope: {
                    creationDate: '='
                },
                controller: ByrushanController,
                controllerAs: 'vm',
                bindToController: true
            };

            return directive;

            /** @ngInject */
            function ByrushanController() {

            }
        });

})();
