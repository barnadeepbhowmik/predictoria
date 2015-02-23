var bettingAppControllers = angular.module('bettingAppControllers', ['bettingAppServices', 'bettingAppFilters']);

bettingAppControllers.controller('LoginController', ['sessionCheck', '$scope', '$http', '$location', function(sessionCheck, $scope, $http, $location) {
	sessionCheck();
	$scope.loginValidationFail = false;
	$scope.loginErrMsg = "";

	$scope.login = function(){
		var payload = {
			"eid" : $scope.login.emp_id,
			"password" : $scope.login.emp_password
		};
		$http.post(environment+"letMeBet",payload)
		.success(function(result){
			if(result.success == true){
				sessionStorage.username = result.results[0].username.replace(/"/g, "");
				sessionStorage.employeeId = $scope.login.emp_id.replace(/"/g, "");
				$location.path("/dashboard");
			}else{
				$scope.loginValidationFail = true;
				if(result.errmsg != null || result.errmsg != "" ){
					$scope.loginErrMsg = result.errmsg;
				}else{
					$scope.loginErrMsg = "Please check the credentials and try again!";
				}
			}
		})
		.error(function(result){
			$scope.loginValidationFail = true;
			$scope.loginErrMsg = "We are facing network issues at the moment, please try again later!";
		});
	};
}]);

bettingAppControllers.controller('RegistrationController', ['sessionCheck', '$scope', '$http', '$location', function(sessionCheck, $scope, $http, $location) {
	sessionCheck();
	$scope.registrationValidationFail = false;
	$scope.registrationErrMsg = "";

	$scope.register = function(){
		var payload = {
			"eid" : $scope.register.emp_id,
			"username" : $scope.register.user_name,
			"password" : $scope.register.emp_password
		};
		$http.post(environment+"makeMeAGambler",payload)
		.success(function(result){
			if(result.success == true){
				sessionStorage.username = $scope.register.user_name.replace(/"/g, "");
				sessionStorage.employeeId = $scope.register.emp_id.replace(/"/g, "");
				$location.path("/dashboard");
			}else{
				$scope.registrationValidationFail = true;
				if(result.errmsg != null || result.errmsg != "" ){
					$scope.registrationErrMsg = result.errmsg;
				}else{
					$scope.registrationErrMsg = "We were unable to sign you up! Please try again.";
				}
			}
		})
		.error(function(result){
			$scope.registrationValidationFail = true;
			$scope.registrationErrMsg = "We are facing network issues at the moment, please try again later!";
		});
	};
}]);

bettingAppControllers.controller('DashboardController', ['sessionCheck', '$scope', '$http', '$location', '$filter', function(sessionCheck, $scope, $http, $location, $filter) {
	sessionCheck();

    $scope.setTab = function(newValue){
      $scope.tab = newValue;
    };

    $scope.isSet = function(tabName){
      return $scope.tab === tabName;
    };

    $scope.tab = 1;

	$scope.username = sessionStorage.username;
	if(sessionStorage.points >= 0){
		$scope.points = sessionStorage.points;
	}
	$http.post(environment+"leaderBoard")
	.success(function(result){
		if(result.success == true){
			$scope.leaders = JSON.parse(result.results);
		}else{
			$scope.leaderboardFail = true;
			if(result.errmsg != null || result.errmsg != "" ){
				$scope.leaderboardErrMsg = result.errmsg;
			}else{
				$scope.leaderboardErrMsg = "We were unable to fetch the leader-board due to network issues";
			}
		}
	})
	.error(function(result){
		$scope.leaderboardErrMsg = "Unable to fetch the leader-board due to network issues!";
	});

	$scope.upcomingMatches = [];

	$http.post(environment+"upcomingMatches")
	.success(function(result){
		if(result.success == true){
			$scope.upcomingMatchesListFail = false;
			$scope.upcomingMatches = JSON.parse(result.results);
		}else{
			$scope.upcomingMatchesListFail = true;
			if(result.errmsg != null || result.errmsg != "" ){
				$scope.upcomingMatchesErrMsg = result.errmsg;
			}else{
				$scope.upcomingMatchesErrMsg = "We were unable to fetch the list of upcoming matches due to network issues!";
			}
		}
	})
	.error(function(result){
		$scope.upcomingMatchesListFail = true;
		$scope.upcomingMatchesErrMsg = "We were unable to fetch the list of upcoming matches due to network issues!";
	});

	var payload = {
		"eid" : sessionStorage.employeeId
	};
	$http.post(environment+"getDashboardData", payload)
	.success(function(result){
		if(result.success == true){
			$scope.points = result.results.points.toString().replace(/"/g, "");
			sessionStorage.points = angular.copy($scope.points);
			$scope.matches = result.results.matches;
		}else{
			$scope.dashboardDataFail = true;
			if(result.errmsg != null || result.errmsg != "" ){
				$scope.dashboardErrMsg = result.errmsg;
			}else{
				$scope.dashboardErrMsg = "We were unable to connect to database due to network issues.";
			}
		}
	})
	.error(function(result){
		$scope.dashboardErrMsg = "We were unable to connect to database due to network issues!";
	});

	$scope.findPos = function(obj) {
	    var curtop = 0;
	    if (obj.offsetParent) {
	        do {
	            curtop += obj.offsetTop;
	        } while (obj = obj.offsetParent);
	    return [curtop];
	    }
	};
	$scope.bet = function(event, match, matchId, teamID){
		var element = angular.element(event.target).parent().parent().parent();
		var payload = {
			"eid" : sessionStorage.employeeId,
			"matchId" : $filter('replaceQuotes')(matchId),
			"teamId" : $filter('replaceQuotes')(teamID)
		};
		match.bet = $filter('replaceQuotes')(teamID);
		$http.post(environment+"saveMyBet", payload)
		.success(function(result){
			if(result.success == true){
				match.betSaved = true;
				match.betFailed = false;
			}else{
				match.betFailed = true;
				match.betSaved = false;
				if(result.errmsg != null || result.errmsg != "" ){
					match.saveErrMsg = result.errmsg;
				}else{
					match.saveErrMsg = "We were unable to save your choice due to network issues! Please try again later.";
				}
			}
			window.scroll(0, $scope.findPos(element[0]));
		})
		.error(function(result){
			match.betFailed = true;
			match.betSaved = false;
			match.saveErrMsg = "We were unable to save your choice due to network issues! Please try again later.";
			window.scroll(0, $scope.findPos(element[0]));
		});
	};

	$scope.logout = function(){
		sessionStorage.clear();
		$location.path("/login");
	};

}]);