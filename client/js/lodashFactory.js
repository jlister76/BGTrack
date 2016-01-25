/**
 * Created by John on 1/23/2016.
 */
var lodash = angular.module('lodash', []);
lodash.factory('_', ['$window', function ($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);
