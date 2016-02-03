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
      'angular-chartist'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
      $stateProvider
        .state('/', {
          controller: 'SnapShotCtrl',
          url: '',
          templateUrl: '../views/main.tmpl.html'
        })
        .state('snapshot', {
          controller: 'SnapShotCtrl',
          url: '/snapshot',
          templateUrl: '../views/main.tmpl.html'
        })
        .state('new-meal', {
          controller: 'SnapShotCtrl',
          parent: '/',
          url: '/new/meal',
          templateUrl: '../views/meallog.form.tmpl.html'
        })
        .state('selector', {
          controller: 'SnapShotCtrl',
          parent: '/',
          url: '/form/select',
          templateUrl: '../views/formselector.html'

        })
        .state('glucose-test', {
          controller: 'SnapShotCtrl',
          parent: '/',
          url: '/new/glucose-test',
          templateUrl: '../views/glucose-test.form.tmpl.html',
          redirectTo: '/'

        })
        .state('new-insulin-injection', {
          controller: 'SnapShotCtrl',
          parent: '/',
          url: '/new/insulin-injection',
          templateUrl: '../views/insulin.form.tmpl.html'
        });

      /*$locationProvider.html5Mode({ enabled: true, requireBase: false });*/
      $urlRouterProvider.otherwise('');
    }])
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('light-blue')


    });

})();
