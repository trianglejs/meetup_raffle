var request = require('request'),
	_       = require('lodash'),
	colors  = require('colors'),
	apiKey  = require('./key').key,
	express = require('express'),
	app     = express(),
	rsvps   = []

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));

/*
 * ======================================
 * ROUTES
 * ======================================
 */

app.get('/', function(req, res) {
	res.render('index.html');
});

app.get('/pick-winner', function(req, res) {
	request.get({
		uri: 'http://api.meetup.com/2/rsvps?&sign=true&event_id=135595992&page=100&rsvp=yes&key='+apiKey,
		json: true
	}, function(err, response, body) {
		res.json(handler(err, response, body));
	});
})

/*
 * ======================================
 * END ROUTES
 * ======================================
 */

function handler(err, response, body) {
	if (err) {
		console.error(err)
		return err;
	}

	rsvps = rsvps.concat(body.results)
	console.log(body.results.length)
	return pickWinner();
}

function pickWinner() {
	var unqiueMembers = _.uniq(rsvps, function(v){return v.member.member_id});
	var winner = unqiueMembers[getRandomInt(0, unqiueMembers.length)];
	console.log("Total number of RSVPs %d", rsvps.length);
	console.log("Unique %d", unqiueMembers.length);
	console.log("Winner is: %s", winner.member.name.bold.green);
	console.dir(winner);
	return winner;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 * Start up Express
 */
app.listen(3000);
console.log('Listening on port 3000');