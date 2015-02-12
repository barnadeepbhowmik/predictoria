var bettingAppFilter = angular.module('bettingAppFilters', ['angularMoment']);

bettingAppFilter.filter("replaceQuotes", function(){
	return function(input){
		return input.toString().replace(/"/g, "");
	};
});



