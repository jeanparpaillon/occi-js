
var myApp=angular.module('occi-js', [
  'ngRoute',
  'occi-xmpp',
  'occi-http'

]);



myApp.config(['$routeProvider',  
  function($routeProvider) {
    $routeProvider.
      when('/xmpp', {
        templateUrl: 'partials/occi-js.html',
        controller: 'xmppCtrl'
      }).
      when('/http', {
        templateUrl: 'partials/occi-js.html',
        controller: 'httpCtrl'
      }).
      otherwise({
        redirectTo: 'http'
      });
  }]);



