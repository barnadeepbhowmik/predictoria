var bettingApp = angular.module('bettingApp',
  ['ngRoute', 'bettingAppControllers', 'bettingAppFilters', 'bettingAppServices', 'angularMoment']);

var environment = "http://localhost:3000/";

bettingApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'app/partials/login.html',
        controller: 'LoginController'
      }).
      when('/login', {
        templateUrl: 'app/partials/login.html',
        controller: 'LoginController'
      }).
      when('/register', {
        templateUrl: 'app/partials/registration.html',
        controller: 'RegistrationController'
      }).
   	  when('/dashboard', {
	    templateUrl: 'app/partials/home.html',
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