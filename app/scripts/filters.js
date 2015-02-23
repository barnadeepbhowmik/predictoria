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


bettingAppFilter.filter("teamName", function(){
	var teams=[{
			"short" : "AUS", 
			"long" : "Australia"
		},
		{
			"short" : "NZ", 
			"long" : "New Zealand"
		},
		{
			"short" : "BAN", 
			"long" : "Bangladesh"
		},
		{
			"short" : "SCO", 
			"long" : "Scotland"
		},
		{
			"short" : "AFG", 
			"long" : "Afganisthan"
		},
		{
			"short" : "SRL", 
			"long" : "Sri Lanka"
		},
		{
			"short" : "ENG", 
			"long" : "England"
		},
		{
			"short" : "IND", 
			"long" : "India"
		},
		{
			"short" : "RSA", 
			"long" : "South Africa"
		},
		{
			"short" : "IRE", 
			"long" : "Ireland"
		},
		{
			"short" : "UAE", 
			"long" : "United Arab Emirates"
		},
		{
			"short" : "WI", 
			"long" : "West Indies"
		},
		{
			"short" : "ZIM", 
			"long" : "Zimbabwe"
		},
		{
			"short" : "PAK", 
			"long" : "Pakistan"
		}

	];
	return function(input){
		for(i in teams){
			if(teams[i].short==input){
				return teams[i].long;
			}
		}
		
	};
});

