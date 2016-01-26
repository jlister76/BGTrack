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
        .state('main', {
          url: '',
          templateUrl: '../views/snapshot.tmpl.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        })
        .state('add', {
          url: '/add',
          templateUrl: '../views/form.tmpl.html'
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
      $urlRouterProvider.otherwise('/');
    }])
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('light-blue')


    });

})();
