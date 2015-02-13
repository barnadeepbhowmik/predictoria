/*, 'bettingAppServices'*/


var bettingAppServices = angular.module('bettingAppServices', []);

bettingAppServices.service("sessionCheck", function($location){
	return function(){
		if(!sessionStorage.employeeId){
			if($location.path() != "/register"){
				$location.path("/login");
			}
		}else{
			$location.path("/dashboard");
		}
	};
});