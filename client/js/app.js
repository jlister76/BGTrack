(function () {
  'use strict';

  angular
    .module('bgTrackApp', [
      'lbServices',
      'ui.router',
      'lodash',
      'ngMaterial',
      'ngMessages',
      'ui.timepicker',
      'nvd3'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
        .state('snapshot', {
          url: '',
          templateUrl: '../views/snapshot.tmpl.html'
          /*controller: 'SnapShotCtrl',
           controllerAs: 'SnapShot'*/
        });
      /*.state('bloodglucose', {
       url: '/glucose',
       templateUrl: '../views/bloodglucose.tmpl.html',
       controller: 'BloodGlucoseCtrl',
       controllerAs: 'BG'
       })
       .state('bloodglucoseform', {
       url: '/glucosetest',
       templateUrl: '../views/glucoseform.tmpl.html',
       controller: 'BloodGlucoseCtrl',
       controllerAs: 'BG'
       });*/
      /*$locationProvider.html5Mode({ enabled: true, requireBase: false });*/
      $urlRouterProvider.otherwise('snapshot');
    }])

})();
