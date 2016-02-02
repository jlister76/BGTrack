(function () {
  'use strict';
  angular
    .module('bgTrackApp')
    .controller('SnapShotCtrl', ['$scope', '$mdMedia', '$mdSidenav', '$log', 'GlucoseTest', '_', '$mdToast', 'InsulinInjection', 'Meal', '$state', function ($scope, $mdMedia, $mdSidenav, $log, GlucoseTest, _, $mdToast, InsulinInjection, Meal, $state) {
      /*var $scope = this;*/

      var today = moment().startOf('day');
      var tomorrow = moment().startOf('day').add(1, 'day');
      console.log(today.format('MM DD YYYY HH:MM'), tomorrow.format('MM DD YYYY HH:MM'));

      $scope.timespans = ['Most Recent', '7 days', '14 days', '30 days', '90 days'];
      $scope.carb = $scope.carb || {dailyCount: null, total: null};
      $scope.glucose = $scope.glucose || {fastingAvg: null, current: {bloodGlucose: 150}};
      $scope.insulin = $scope.insulin || {units: null, longLasting: null};


      function getCarbs() {
        Meal
          .find()
          .$promise
          .then(function (data) {
            //console.info(data);
            var dailyCarbs = [];
            var totalCarbs = [];
            var dataGroup = _.groupBy(data, function (d) {
              var mealDateTime = moment(d.mealDateTime);

              if (mealDateTime.isBetween(today, tomorrow)) {
                dailyCarbs.push(d.carbCount);

              } else {
                totalCarbs.push(d.carbCount);
              }

            });
            //console.info(arr);
            $scope.carb.total = _.sum(totalCarbs);
            $scope.carb.dailyCount = _.sum(dailyCarbs);
            //console.info(sunOfCarbs);

          });
      }

      function mostCurrent() {
        GlucoseTest
          .find({
            filter: {
              order: 'testDateTime DESC',
              limit: 2
            }
          })
          .$promise
          .then(function (data) {
            console.info(data);
            console.info(typeof(data));

            $scope.glucose.current = data[0];
            $scope.glucose.prev = data[1];
            console.info($scope.glucose.current, $scope.glucose.prev);


          })
      }

      mostCurrent();
      function glucoseCalculations() {
        GlucoseTest
          .find({order: 'testDateTime'})
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
            $scope.glucose.A1c = (46.7 + avgOfDailyAvgs) / 28.7;

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
            $scope.glucose.weeklyAvg = sumOfReadingsFor7Days / testReadingsFor7Days.length;

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
            $scope.glucose.fastingAvg = fastingAverages / past72HoursFasting.length;

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
              //console.log(data[inj]);
              var injDateTime = moment(data[inj].injectionDateTime);
              if (injDateTime.isBetween(today, tomorrow)) {
                insulinUnits.push(data[inj].units);
                if (data[inj].fastActing) {
                  fastActingUnits.push(data[inj].units);
                }
              }

            }
            /* _.forEach(data, function(inj){
             /!* insulinUnits.push(inj.units);*!/
             //console.info(insulinUnits.length);
             if(inj.fastActing){
             fastActingUnits.push(inj.units);
             }
             });*/

            $scope.insulin.units = _.sum(insulinUnits);

            $scope.insulin.fastActing = _.sum(fastActingUnits);

            $scope.insulin.longLasting = _.subtract($scope.insulin.units, $scope.insulin.fastActing);
            /* console.log($scope.insulin.longLasting);
             console.log($scope.insulin.units);*/
          });

      }

      getCarbs();
      glucoseCalculations();
      getInsulin();


      $scope.testDateTime = moment();
      $scope.options = {
        step: 5,
        timeFormat: 'H:i'
      };

      $scope.toggleLeft = function () {
        $mdSidenav('left').toggle()
          .then(function () {
            $log.debug("toggle left is done");
          });
      };
      $scope.onSwipe = function (ev) {
        console.info('Swiped');
        $mdSidenav('left').close()

      };
      $scope.close = function (ev) {
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

      $scope.addNewMeal = function () {
        Meal
          .create($scope.newMeal)
          .$promise
          .then(function (meal) {
            $scope.newMeal = '';
            $scope.meallogForm.description.$setPristine();
            $('.focus').focus();
            getCarbs();
            showCustomToast()
          })


      };

      $scope.addTestResults = function () {
        GlucoseTest
          .create($scope.newTestResult)
          .$promise
          .then(function (bloodGlucose) {
            $scope.newTestResult = '';
            $scope.glucoseTestForm.result.$setPristine();
            $('.focus').focus();
            mostCurrent();
            glucoseCalculations();
            showCustomToast();
            $state.go('root');

          })

      };
      $scope.addNewInjection = function () {
        InsulinInjection
          .create($scope.newInjection)
          .$promise
          .then(function (units) {
            $scope.newInjection = '';
            $scope.insulinControlForm.unit.$setPristine();
            $('.focus').focus();
            getInsulin();
            showCustomToast()
          })

      };

      //CHARTIST DEMO


      $scope.barOptions = {
        seriesBarDistance: 15
      };

      $scope.barResponsiveOptions = [
        ['screen and (min-width: 901px) and (max-width: 1024px)', {
          seriesBarDistance: 10,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value;
            }
          }
        }],
        ['screen and (max-width: 900px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

      $scope.a = 42;
      $scope.b = 50;
      // line chart
      $scope.lineData = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        series: [
          /*[0, 1, 2, 4, 7, 6, 9, 10, 8, 10, 14, 13, 16, 14, 17, 19, 20, 31, 32, 26, 36, 28, 31, 40, 26, 26, 43, 47, 55, 30],
           [0, 1, 2, 4, 4, 6, 6, 13, 9, 10, 16, 18, 21, 16, 16, 16, 31, 17, 27, 23, 31, 29, 35, 39, 30, 32, 26, 43, 51, 46],
           [0, 1, 3, 4, 6, 5, 11, 9, 11, 11, 13, 15, 14, 22, 20, 15, 31, 27, 25, 25, 36, 30, 37, 29, 29, 39, 40, 49, 34, 35],
           [0, 1, 3, 5, 7, 5, 9, 9, 10, 17, 13, 21, 14, 16, 23, 23, 25, 17, 24, 34, 27, 39, 33, 45, 47, 32, 40, 36, 49, 32],*/
          [$scope.glucose.current.bloodGlucose, 24, 31, 29, $scope.a]
        ]
      },
      {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      },

        $scope.lineOptions = {
          axisX: {
            labelInterpolationFnc: function (value) {
              return value;
            }
        }
        };

    }]);//EOC

})();
