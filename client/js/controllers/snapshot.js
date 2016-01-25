(function () {
  'use strict';
  angular
    .module('bgTrackApp')
    .controller('SnapShotCtrl', ['$mdMedia', '$mdSidenav', '$log', function ($mdMedia, $mdSidenav, $log) {
      var vm = this;
      vm.greet = 'Hello';
      vm.$mdMedia = $mdMedia;

      vm.toggleLeft = function () {
        $mdSidenav('left').toggle()
          .then(function () {
            $log.debug("toggle left is done");
          });
      };

      vm.close = function () {
        $mdSidenav('left').close()
          .then(function () {
            $log.debug("close LEFT is done");
          });
      };
    }]);

})();
