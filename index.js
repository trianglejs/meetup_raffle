var request = require('request')
var _       = require('lodash')
var colors  = require('colors')
var apiKey  = require('./key').key

var pending = 2
var rsvps   = []

request.get({
	uri: 'http://api.meetup.com/2/rsvps?&sign=true&event_id=135595992&page=100&rsvp=yes&key='+apiKey,
	json: true
}, handler)

request.get({
	uri: 'http://api.meetup.com/2/rsvps?&sign=true&event_id=135135422&page=100&rsvp=yes&key='+apiKey,
	json: true
}, handler)


function handler(err, response, body) {
	if (err) {
		console.error(err)
		return
	}
	rsvps = rsvps.concat(body.results)
	console.log(body.results.length)
	if (--pending == 0) {
		pickWinner()
	}
}

function pickWinner() {
	var unqiueMembers = _.uniq(rsvps, function(v){return v.member.member_id})
	var winner = unqiueMembers[getRandomInt(0, unqiueMembers.length)]
	console.log("Total number of RSVPs %d", rsvps.length)
	console.log("Unique %d", unqiueMembers.length)
	console.log("Winner is: %s", winner.member.name.bold.green)
	console.dir(winner)
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}