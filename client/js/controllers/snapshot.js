(function () {
  'use strict';
  angular
    .module('bgTrackApp')
    .controller('SnapShotCtrl', ['$mdMedia', '$mdSidenav', '$log', 'GlucoseTest', '_', '$mdToast', 'InsulinInjection', 'Meal', function ($mdMedia, $mdSidenav, $log, GlucoseTest, _, $mdToast, InsulinInjection, Meal) {
      var vm = this;

      var today = moment().startOf('day');
      var tomorrow = moment().startOf('day').add(1, 'day');
      console.log(today.format('MM DD YYYY HH:MM'), tomorrow.format('MM DD YYYY HH:MM'));
      vm.range = vm.range || {
          recent: 'Most Recent',
          week: '7 day',
          twoWeek: '14 day',
          month: '30 day',
          threeMonth: '90 day'
        };
      vm.carb = vm.carb || {count: null};
      vm.glucose = vm.glucose || {fastingAvg: null};
      vm.insulin = vm.insulin || {units: null, longLasting: null};


      function getCarbs() {
        Meal
          .find()
          .$promise
          .then(function (data) {
            //console.info(data);
            var arr = [];
            var dataGroup = _.groupBy(data, function (d) {
              var mealDateTime = moment(d.mealDateTime);


              if (moment(mealDateTime).isBefore(tomorrow)) {
                arr.push(d.carbCount);
                //console.info(arr);
              }

            });
            //console.info(arr);
            vm.carb.count = _.sum(arr);
            //console.info(sunOfCarbs);

          });
      }

      function glucoseCalculations() {
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
            var A1C = (46.7 + avgOfDailyAvgs) / 28.7;
            vm.glucose.A1c = A1C;
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
            var daily7 = sumOfReadingsFor7Days / testReadingsFor7Days.length;
            vm.glucose.weeklyAvg = daily7;
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
            var fastingAvg = fastingAverages / past72HoursFasting.length;
            vm.glucose.fastingAvg = fastingAvg;
          });
      }


      function getInsulin() {
        InsulinInjection
          .find()
          .$promise
          .then(function (data) {
            var insulinUnits = [];
            var fastActingUnits = [];
            console.log(data);

            for (var inj in data) {
              console.log(data[inj]);
              insulinUnits.push(data[inj].units);
              if (data[inj].fastActing) {
                fastActingUnits.push(data[inj].units);
              }
            }
            /* _.forEach(data, function(inj){
             /!* insulinUnits.push(inj.units);*!/
             //console.info(insulinUnits.length);
             if(inj.fastActing){
             fastActingUnits.push(inj.units);
             }
             });*/

            vm.insulin.units = _.sum(insulinUnits);

            vm.insulin.fastActing = _.sum(fastActingUnits);

            vm.insulin.longLasting = _.subtract(vm.insulin.units, vm.insulin.fastActing);


            console.info("I was ran");
            console.log(vm.insulin.longLasting);
            console.log(vm.insulin.units);
          });

      }

      getCarbs();
      glucoseCalculations();
      getInsulin();


      vm.testDateTime = moment();
      vm.options = {
        step: 5,
        timeFormat: 'H:i'
      };

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

      vm.addNewMeal = function () {
        Meal
          .create(vm.newMeal)
          .$promise
          .then(function (meal) {
            vm.newMeal = '';
            vm.meallogForm.description.$setPristine();
            $('.focus').focus();
            getCarbs();
            showCustomToast()
          })


      };

      vm.addTestResults = function () {
        GlucoseTest
          .create(vm.newTestResult)
          .$promise
          .then(function (bloodGlucose) {
            vm.newTestResult = '';
            vm.glucoseTestForm.result.$setPristine();
            $('.focus').focus();
            glucoseCalculations();
            showCustomToast()
          })

      };
      vm.addNewInjection = function () {
        InsulinInjection
          .create(vm.newInjection)
          .$promise
          .then(function (units) {
            vm.newInjection = '';
            vm.insulinControlForm.unit.$setPristine();
            $('.focus').focus();
            getInsulin();
            showCustomToast()
          })

      };

    }]);//EOC

})();
