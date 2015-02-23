var bettingApp = angular.module('bettingApp',
  ['ngRoute', 'bettingAppControllers', 'bettingAppFilters', 'bettingAppServices', 'angularMoment']);

//var environment = "http://localhost:3000/";
var environment = "http://voteyourteam.herokuapp.com/";

bettingApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'js/partials/login.html',
        controller: 'LoginController'
      }).
      when('/login', {
        templateUrl: 'js/partials/login.html',
        controller: 'LoginController'
      }).
      when('/register', {
        templateUrl: 'js/partials/registration.html',
        controller: 'RegistrationController'
      }).
      when('/dashboard', {
      templateUrl: 'js/partials/home.html',
      controller: 'DashboardController'
    }).
    otherwise({
      redirectTo: '/'
    });
  }]);

bettingApp.constant('angularMomentConfig', {
    preprocess: 'utc', // optional
    timezone: 'Europe/London' // optional
});