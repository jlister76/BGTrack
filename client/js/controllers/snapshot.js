(function () {
  'use strict';
  angular
    .module('bgTrackApp')
    .controller('SnapShotCtrl', ['$mdMedia', '$mdSidenav', '$log', 'GlucoseTest', '_', '$mdToast', function ($mdMedia, $mdSidenav, $log, GlucoseTest, _, $mdToast) {
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

      //Custom Toast Msg
      function showCustomToast() {
        $mdToast.show({
          /*controller: 'ToastCtrl',*/
          templateUrl: '../views/toast.tmpl.html',
          parent: angular.element(document).find('#projectForm'),
          hideDelay: 6000,
          position: 'bottom left',
          capsule: true

        });
      }

      vm.testDateTime = moment();
      vm.options = {
        step: 5,
        timeFormat: 'H:i'
      };

      vm.addTestResults = function () {
        GlucoseTest
          .create(vm.newTestResult)
          .$promise
          .then(showCustomToast())
          .then(function (bloodGlucose) {
            vm.newTestResult = '';
            vm.glucoseTestForm.result.$setPristine();
            $('.focus').focus()
          }), function (error) {
          consoloe.error('Error. Unable to save your information.' + error);
        }

      }

    }]);

})();
