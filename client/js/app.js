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
        .state('root', {
          controller: 'SnapShotCtrl',
          controllerAs: 'sS',
          url: '',
          templateUrl: '../views/main.tmpl.html'
        })
        .state('root.new-meal', {
          controller: 'SnapShotCtrl',
          controllerAs: 'sS',
          parent: 'root',
          url: '/new/meal',
          templateUrl: '../views/meallog.form.tmpl.html'
        })
        .state('root.selector', {
          controller: 'SnapShotCtrl',
          controllerAs: 'sS',
          parent: 'root',
          url: '/form/select',
          templateUrl: '../views/formselector.html'

        })
        .state('root.glucose-test', {
          controller: 'SnapShotCtrl',
          controllerAs: 'sS',
          parent: 'root',
          url: '/new/glucose-test',
          templateUrl: '../views/glucose-test.form.tmpl.html'
        })
        .state('root.new-insulin-injection', {
          controller: 'SnapShotCtrl',
          controllerAs: 'sS',
          parent: 'root',
          url: '/new/insulin-injection',
          templateUrl: '../views/insulin.form.tmpl.html'
        });

      /*$locationProvider.html5Mode({ enabled: true, requireBase: false });*/
      $urlRouterProvider.otherwise('root');
    }])
    .config(function($mdThemingProvider){
      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('light-blue')


    });

})();
