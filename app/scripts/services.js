/*, 'bettingAppServices'*/


var bettingAppServices = angular.module('bettingAppServices', []);

bettingAppServices.service("sessionCheck", function($location){
	return function(){
		if(!sessionStorage.employeeId){
			$location.path("/login");
		}else{
			$location.path("/dashboard");
		}
	};
});