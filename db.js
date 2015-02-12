var connection;
var moment = require('moment')
exports.setupDBAndTable = function (conn) {
    //save connection
    connection = conn;
};

exports.checkCreds = function (employeeid, password, client, callback) {
	var userIsAuthentic = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  var query = 'select * from "Employees" where "eid"='+ employeeid +' and "password"=\''+ password +'\'';
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    callback(null);
	  	}
	    if(result && result.rows.length == 1  && JSON.stringify(result.rows[0].eid) == employeeid){
			userIsAuthentic = true;
	    }
	  	client.end();
	  	if(userIsAuthentic){
	  		callback(userIsAuthentic, JSON.stringify(result.rows[0].username));
	  	}else{
	  		callback(userIsAuthentic, null);
	  	}
	  });
	});
};

exports.registerMe = function (username, employeeid, password, client, callback) {
	var userIsRegistered = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  var query = 'INSERT INTO "Employees"(eid, password, username) VALUES ('+ employeeid +', \''+ password +'\', \''+ username +'\')';
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    callback(null);
	  	}
	    if(result){
			userIsRegistered = true;
	    }
	  	client.end();
  		callback(userIsRegistered);
	  });
	});
};


exports.dashboardData = function (eid, client, callback) {
	var data = {
		"points" : 0,
		"matches" : []
	};
    client.connect(function(err)
	{
	    if(err) {
	      callback(null);
	    }
	    var queryPoints = "SELECT sum(points) AS points FROM \"Points\" WHERE eid = "+eid;
	    client.query(queryPoints, function(err, result){
			if(err) {
		    	callback(null);
		  	}
		  	if(result){
				data.points = JSON.stringify(result.rows[0].points) || 0;
				var today = moment().format("YYYY-MM-DD");
				var tomorrow = moment(today).add(1, "days").format("YYYY-MM-DD");
				var query = 'SELECT matchid, teama, teamb, venue, datefield FROM \"Matches\" WHERE datefield = \''+ tomorrow +'\'';
				client.query(query, function(err, result)
				  {
				    if(result && result.rows.length >= 1){
				    	for(i in result.rows){
							var match = {
								"matchid" : 0,
								"teama" : "",
								"teamb" : "",
								"venue" : "",
								"datefield" : ""
							};
					    	match.matchid = JSON.stringify(result.rows[i].matchid);
					    	match.teama = JSON.stringify(result.rows[i].teama);
					    	match.teamb = JSON.stringify(result.rows[i].teamb);
					    	match.venue = JSON.stringify(result.rows[i].venue);
					    	match.datefield = JSON.stringify(result.rows[i].datefield);
					    	data.matches.push(match);
				    	}
				    }
				    callback(data);
			      });
		  	}
    		client.end();
  		});

	});
};

exports.checkBet = function (employeeid, matchId, teamId, client, callback) {
	var betPresent = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  var query = 'SELECT points, matchid, choice, eid FROM "Points" WHERE matchid = \''+ matchId +'\' AND eid = '+ employeeid;
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    callback(null);
	  	}
	    if(result && result.rows.length>0){
			betPresent = true;
	    }
	  	client.end();
  		callback(betPresent);
	  });
	});
};

exports.saveBet = function (employeeid, matchId, teamId, client, callback) {
	var betSaved = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  var query = 'INSERT INTO "Points"( points, matchid, choice, eid) VALUES (0, '+ matchId +', \''+ teamId +'\', '+ employeeid +')';
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    callback(null);
	  	}
	    if(result){
			betSaved = true;
	    }
	  	client.end();
  		callback(betSaved);
	  });
	});
};

exports.modifyBet = function (employeeid, matchId, teamId, client, callback) {
	var betSaved = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  var query = 'UPDATE "Points" SET choice=\''+ teamId +'\' WHERE matchid=\''+ matchId +'\' and eid=' + employeeid;
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    callback(null);
	  	}
	    if(result){
			betSaved = true;
	    }
	  	client.end();
  		callback(betSaved);
	  });
	});
};

exports.getLeaderBoard = function (client, callback) {
	var leaderBoard = false;
    client.connect(function(err)
	{
	  if(err) {
	    callback(null);
	  }
	  //var query = 'SELECT sum(points) AS pts , eid FROM "Points" GROUP BY eid ORDER BY pts DESC LIMIT 5';
	  var query = 'SELECT "Employees".username, sum("Points".points) AS pts , "Points".eid FROM "Employees", "Points" WHERE  "Employees".username IN (SELECT "Employees".username FROM "Employees" WHERE "Employees".eid="Points".eid) GROUP BY "Employees".username, "Points".eid ORDER BY pts DESC LIMIT 5';
	  client.query(query, function(err, result)
	  {
	    if(err) {
	    	callback(null);
	  	}
	    if(result && result.rows.length>=1){
			leaderBoard = JSON.stringify(result.rows);
	    }
	  	client.end();
  		callback(leaderBoard);
	  });
	});
};