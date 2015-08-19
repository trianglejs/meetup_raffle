(function() {
	'use strict';

	/*global document, $*/
	$(document).ready(function() {
		var time = 5,
			start = 5,
			spinner,
			$timerBtn = $('#timerBtn'),
			$timer = $('#timer'),
			$winner = $('#winner'),
			$next = $('#next').hide(),
			spinnerOptions = {
				lines: 14, // The number of lines to draw
				length: 20, // The length of each line
				width: 10, // The line thickness
				radius: 30, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#333', // #rgb or #rrggbb or array of colors
				speed: 1, // Rounds per second
				trail: 60, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: '-15px', // Top position relative to parent in px
				left: 'auto' // Left position relative to parent in px
			};

		function getWinner() {
			$timer.empty();

			var target = document.getElementById('timer')
			spinner = new Spinner(spinnerOptions).spin(target);

			var params = deparam(location.search)
			if (!params.event_id) {
				alert('No event_id!');
				return;
			}
			getAttendees(params.event_id);
		}

		function deparam(search) {
			var ret = {},
				seg = search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		}

		var attendees = [], theChoosen

		function renderAttendee(attendee) {
			var out = [];
			if (attendee.member_photo) {
				out.push('<img src="'+attendee.member_photo.photo_link +'" class="img-rounded"><br />')
			}
			out.push(attendee.member.name)
			return out.join('')
		}

		function getAttendees(event_id) {
			$.getJSON('/attendees',{event_id:event_id}, function(data) {
				attendees = data.results.filter(yesOrWaitlist);
				theChoosen = getRandomAttendees(attendees.length, 20);
				setWinner(0);
				$next.show();
				spinner.stop();
			})
		}

		function setWinner(index) {
			if (index >= theChoosen.length) {
				index = 0
			}
			$winner.html(renderAttendee(attendees[theChoosen[index]])).hide().fadeIn().data('index', index);
		}

		function getRandomAttendees(max, howMany) {
		    var picked = [], choosen;
		    for(;;) {
		        choosen = getRandomInt(0, max-1)
		        if (!~picked.indexOf(choosen)) {
		            picked.push(choosen)
		        }
		        if (howMany == picked.length) break;
		    }
		    return picked;
		}

		function getRandomInt (min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function yesOrWaitlist(attendee) {
			return attendee.response == 'yes' || attendee.response == 'waitlist';
		}

		function countDown() {
			setTimeout(function() {
				time -= 1;
				$('#timer div:nth-child(' + (start - time + 1) + ')').prev().hide();
				$('#timer div:nth-child(' + (start - time + 1) + ')').show().addClass('scaleIt');

				if (time > 0) {
					countDown();
				} else {
					getWinner();
				}
			}, 1000);
		}

		$next.on('click', function(event){
			event.preventDefault();
			setWinner($winner.data('index')+1)
			return false;
		})

		$timerBtn.on('click', function() {
			$timerBtn.fadeOut(function() {
				$('#timer div:nth-child(1)').show().addClass('scaleIt');
				countDown();
			});
		});
	});
}());
