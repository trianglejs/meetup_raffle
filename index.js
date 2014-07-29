var request = require('request'),
	apiKey  = require('./key').key,
	express = require('express'),
	app     = express()

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

app.get('/attendees', function(req, res) {
	var event_id = req.param('event_id');
	if (event_id) {
		return request.get('http://api.meetup.com/2/rsvps?&sign=true&event_id='+ event_id +'&page=200&key='+apiKey).pipe(res);
	}
});

/*
 * ======================================
 * END ROUTES
 * ======================================
 */


/*
 * Start up Express
 */
app.listen(3000);
console.log('Listening on port 3000');