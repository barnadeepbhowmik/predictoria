var express = require('express'),
 http = require('http'),
 path = require('path'),
 deepcopy = require('deepcopy'),
 pg = require('pg'),
 url = require("url"),
 lib = require('./db.js'),
 moment = require('moment');

 //Congifure eXxpress
var app = express();

//var conString = "postgres://riwxxeiaahuzre:OuG5IAooAA-s2PmfQteEKaa1QR@ec2-54-204-27-32.compute-1.amazonaws.com:5432/d42bb4af96j205";
var conString = "postgres://postgres:postgres@localhost:5432/postgres";

var connection = new pg.Client(conString);

connection.connect(function () {
    lib.setupDBAndTable(connection);
});

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('Cookies'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '/')));
    app.use(function(req, res) {
 	 // Use res.sendfile, as it streams instead of reading the file into memory.
 		res.sendfile(__dirname + '/index.html');
	});
});

app.configure('development', function () {
    app.use(express.errorHandler());
});


var returnObj = {
	"success" : false,
	"errmsg" : "",
	"results" : []
};

app.post('/testPost', function(request, response){
	response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
	response.json({'status':'success'});

});

app.post('/letMeBet', function(request, response){
	var client = new pg.Client(conString);
	var req = request.body;
	lib.checkCreds(req.eid, req.password, client, function(userIsAuthentic, username){
		var myRetObj = deepcopy(returnObj);
		if(userIsAuthentic && username!= null){
			myRetObj.success = true;
			myRetObj.results=[{
				"username": username
			}];
		}else{
			myRetObj.success = false;
			myRetObj.errmsg = "Sorry, entered employee id is not yet registered! Please check the inputs or register if new!";
		}
		response.setHeader('Access-Control-Allow-Origin', "*");
		response.setHeader('Content-Type', "application/json");
		response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
		response.end(JSON.stringify(myRetObj));
	});
});


app.post('/makeMeAGambler', function(request, response){
	var client = new pg.Client(conString);
	var req = request.body;
	lib.registerMe(req.username, req.eid, req.password, client, function(userIsRegistered){
		var myRetObj = deepcopy(returnObj);
		if(userIsRegistered){
			myRetObj.success = true;
		}else{
			myRetObj.success = false;
			myRetObj.errmsg = "Sorry, employee already registered or database is down at the moment, please try later!";
		}
		response.setHeader('Access-Control-Allow-Origin', "*");
		response.setHeader('Content-Type', "application/json");
		response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
		response.end(JSON.stringify(myRetObj));
	});
});

app.post('/getDashboardData', function(request, response){
	var client = new pg.Client(conString);
	var req = request.body;
	var data = {
		"points" : 0,
		"matches" : []
	};
	lib.getPoints(req.eid, client, function(points){
		var myRetObj = deepcopy(returnObj);
		if(points){
			data.points = points;
		}else{
			myRetObj.success = false;
			myRetObj.errmsg = "Sorry, we are facing network issues, please try later!";
		}
		lib.matchesForBetting(req.eid, new pg.Client(conString), function(matches){
			if(matches){
				data.matches = matches;
				myRetObj.success = true;
			}else{
				myRetObj.success = false;
				myRetObj.errmsg = "Sorry, we are facing network issues, please try later!";
			}
			myRetObj.results = data;
			response.setHeader('Access-Control-Allow-Origin', "*");
			response.setHeader('Content-Type', "application/json");
			response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
			response.end(JSON.stringify(myRetObj));
		});
	});
});

app.post('/saveMyBet', function(request, response){
	var client = new pg.Client(conString);
	var req = request.body;

	lib.checkBet(req.eid, req.matchId, req.teamId, client, function(betPresent){
		if(betPresent == null){
			var myRetObj = deepcopy(returnObj);
			myRetObj.success = false;
			myRetObj.errmsg = "Sorry, we are facing network issues, please try later!";
			response.setHeader('Access-Control-Allow-Origin', "*");
			response.setHeader('Content-Type', "application/json");
			response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
			response.end(JSON.stringify(myRetObj));
		}
		else if(!betPresent){
			lib.saveBet(req.eid, req.matchId, req.teamId, new pg.Client(conString), function(data){
				var myRetObj = deepcopy(returnObj);
				if(data){
					myRetObj.success = true;
				}else{
					myRetObj.success = false;
					myRetObj.errmsg = "Sorry, we are facing network issues, please try later!";
				}
				response.setHeader('Access-Control-Allow-Origin', "*");
				response.setHeader('Content-Type', "application/json");
				response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
				response.end(JSON.stringify(myRetObj));
			});
		}else{
			lib.modifyBet(req.eid, req.matchId, req.teamId, new pg.Client(conString), function(data){
				var myRetObj = deepcopy(returnObj);
				if(data){
					myRetObj.success = true;
				}else{
					myRetObj.success = false;
					myRetObj.errmsg = "Sorry, we were unable to update your date because of network issues, please try later!";
				}
				response.setHeader('Access-Control-Allow-Origin', "*");
				response.setHeader('Content-Type', "application/json");
				response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
				response.end(JSON.stringify(myRetObj));
			});
		}
	});
});

app.post('/leaderBoard', function(request, response){
	var client = new pg.Client(conString);
	var req = request.body;
	lib.getLeaderBoard(client, function(data){
		var myRetObj = deepcopy(returnObj);
		if(data){
			myRetObj.success = true;
			myRetObj.results = data;
		}else{
			myRetObj.success = false;
			myRetObj.errmsg = "Sorry, we were unable to fetch the leaderBoard, please try later!";
		}
		response.setHeader('Access-Control-Allow-Origin', "*");
		response.setHeader('Content-Type', "application/json");
		response.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
		response.end(JSON.stringify(myRetObj));
	});
});

//start the Server
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});