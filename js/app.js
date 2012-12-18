angular.module('plugins', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/maps', { templateUrl: 'partials/maps/index.html', controller: MapsCtrl }).
      otherwise({redirectTo: '/'});
}]);