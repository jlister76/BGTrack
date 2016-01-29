(function () {
  'use strict';
  angular
    .module('bgTrackApp')
    .controller('SnapShotCtrl', ['$mdMedia', '$mdSidenav', '$log', 'GlucoseTest', '_', '$mdToast', 'InsulinInjection', 'Meal', function ($mdMedia, $mdSidenav, $log, GlucoseTest, _, $mdToast, InsulinInjection, Meal) {
      var vm = this;
      vm.greet = 'Hello';
      vm.$mdMedia = $mdMedia;

      vm.toggleLeft = function () {
        $mdSidenav('left').toggle()
          .then(function () {
            $log.debug("toggle left is done");
          });
      };
      vm.onSwipe = function(ev){
        console.info('Swiped');
        $mdSidenav('left').close()

      };
      vm.close = function (ev) {
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
          })

      };
      vm.addNewInjection = function () {
        InsulinInjection
          .create(vm.newInjection)
          .$promise
          .then(showCustomToast())
          .then(function (injection) {
            vm.newInjection = '';
            vm.insulinControlForm.unit.$setPristine();
            $('.focus').focus()
          })

      };
      vm.addNewMeal = function () {
        Meal
          .create(vm.newMeal)
          .$promise
          .then(showCustomToast())
          .then(function (meal) {
            vm.newMeal = '';
            vm.meallogForm.description.$setPristine();
            $('.focus').focus()
          })

      };

      vm.glucoseCalculations = function () {
        GlucoseTest
          .find()
          .$promise
          .then(function (results) {
            //A1c
            var groupByDateCollection = _.groupBy(results, function (item) {
              return item.testDateTime.substring(0, 10);
            });

            var dailyAverages = [];
            for (var date in groupByDateCollection) {
              var testReadings = _.map(groupByDateCollection[date], 'bloodGlucose');
              var sum = testReadings.reduce(function (a, b) {
                return a + b;
              });
              dailyAverages.push(sum / testReadings.length);
            }
            var sumOfAvgs = dailyAverages.reduce(function (a, b) {
              return a + b;
            });
            var avgOfDailyAvgs = sumOfAvgs / dailyAverages.length;
            vm.A1c = (46.7 + avgOfDailyAvgs) / 28.7;

            //Daily Averages
            var testReadingsFor7Days = [];
            var data = _.filter(results, function (o) {
              return o.testDateTime
            });

            _(data)
              .forEach(function (x) {

                if (moment(x.testDateTime).isAfter(moment().hours(-168))) {
                  testReadingsFor7Days.push(x.bloodGlucose);
                }
              });
            var sumOfReadingsFor7Days = testReadingsFor7Days.reduce(function (a, b) {
              return a + b;
            });
            vm.daily7 = sumOfReadingsFor7Days / testReadingsFor7Days.length;

            //Fasting Averages
            var past72HoursFasting = [];
            var allFastingResults = _.filter(results, function (o) {
              return o.fasting;
            });

            _(allFastingResults)
              .forEach(function (o) {
                if (moment(o.testDateTime).isAfter(moment().hours(-72))) {
                  past72HoursFasting.push(o);
                }
              });
            var fastingAverages = _.sumBy(past72HoursFasting, function (item) {
              return item.bloodGlucose
            });
            vm.fastingAvg = fastingAverages / past72HoursFasting.length;

          })
      };
      vm.glucoseCalculations();

    }]);//EOC

})();
