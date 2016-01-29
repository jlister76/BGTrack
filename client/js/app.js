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
        .state('/', {
          url: '',
          templateUrl: '../views/snapshot.tmpl.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        })
        .state('selector', {
          url: '/form/select',
          templateUrl: '../views/formselector.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        })
        .state('glucose-test', {
          url: '/new/glucose-test',
          templateUrl: '../views/form.tmpl.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        })
        .state('new-insulin-injection', {
          url: '/new/insulin-injection',
          templateUrl: '../views/insulin.form.tmpl.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        })
        .state('new-meal', {
          url: '/new/meal',
          templateUrl: '../views/meallog.form.tmpl.html',
          controller: 'SnapShotCtrl',
          controllerAs: 'SS'
        });

      /*$locationProvider.html5Mode({ enabled: true, requireBase: false });*/
      $urlRouterProvider.otherwise('/');
    }])
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('light-blue')


    });

})();
