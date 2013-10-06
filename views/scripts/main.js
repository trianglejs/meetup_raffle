(function() {
	'use strict';

	/*global document, $*/
	$(document).ready(function() {
		var time = 5,
			start = 5,
			$timerBtn = $('#timerBtn'),
			$timer = $('#timer'),
			$winner = $('#winner'),
			spinnerOptions = {
				lines: 14, // The number of lines to draw
				length: 20, // The length of each line
				width: 10, // The line thickness
				radius: 30, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 0, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#fff', // #rgb or #rrggbb or array of colors
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

			var target = document.getElementById('timer'),
				spinner = new Spinner(spinnerOptions).spin(target);

			$.getJSON('/pick-winner', function(data) {
				$winner.html(data.member.name).hide().fadeIn();
				spinner.stop();
			});
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

		$timerBtn.on('click', function() {
			$timerBtn.fadeOut(function() {
				$('#timer div:nth-child(1)').show().addClass('scaleIt');
				countDown();
			});
		});
	});
}());