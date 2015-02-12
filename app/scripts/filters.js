var bettingAppFilter = angular.module('bettingAppFilters', ['angularMoment']);

bettingAppFilter.filter("replaceQuotes", function(){
	return function(input){
		return input.toString().replace(/"/g, "");
	};
});

bettingAppFilter.filter("capitalizeFirst", function(){
	return function(input){
		return input.charAt(0).toUpperCase() + input.slice(1);
	};
});

