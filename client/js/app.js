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
        .state('home', {
          url: '/',
          views: {
            '@': {
              templateUrl: '../views/content.tmpl.html'
            },
            'menu@': {
              templateUrl: '../views/tmpls/menu.html',
              controller: 'SnapShotCtrl',
              controllerAs: 'SS'
            },
            'sidenav@': {
              templateUrl: '../views/tmpls/sidenav.html',
              controller: 'SnapShotCtrl',
              controllerAs: 'SS'
            },
            'footer@': {
              templateUrl: '../views/tmpls/footer.html'
            }
          }
        })
        .state('home.snapshot', {
          url: '/snapshot',
          views: {
            '^@home': {
              templateUrl: '../views/snapshot.tmpl.html',
              controller: 'SnapShotCtrl',
              controllerAs: 'SS'
            }
          }
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
        .dark()

    });

})();
