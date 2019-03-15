define(['store', 'computed', 'request', 'popups', 'dataHelper', 'scrollHelper'], function(store, computed, request, popups, helper, scroll) {
	function emptyOnEsc(e) {
		if (e.keyCode === 27) { // escape key maps to keycode `27`
			store.quickFilter = "";
		}
	}
	
	function forceUpdate(event) {
		event.preventDefault();
		store.updating = true;
		var href = request.getForceUpdateUrl();
		console.log(href);
		request.getWithToken(href, store.token, function(result) {
			popups.alert("Refresh Data", "Success!", function() {
				store.updating = false;
			});
		}, onError);
	}

	function exportFavorites(event) {
		event.preventDefault();
		store.updating = true;
		var href = request.getForceUpdateUrl();
		console.log(href);
		request.getWithToken(href, store.token, function(result) {
			popups.alert("Refresh Data", "Success!", function() {
				store.updating = false;
			});
		}, onError);
	}

	function confirmAndUpdate(theTalk, newValueForSeats) {
		function isFullyBooked(occupied, available) {
			var threshold = 0.95;
			if (occupied === 0 || available === 0) {
				return false;
			}
			return occupied / available >= threshold;
		}

		var status = isFullyBooked(newValueForSeats, theTalk.availableSeats) ? "Fully booked" : "Free";
		var message = "<span>Room: </span><em class=\"dark\">"
			+ theTalk.roomName
			+ "</em>\n<span>Time: </span><em class=\"dark\">" + theTalk.formattedStart
			+ "</em>\n\n<span>Occupied seats: </span><em>"+ newValueForSeats
			+ "</em>\n\n<span>New Status: </span><em class=\"" + status.replace(" ", "") + "\">"
			+ status
			+ "</em>\n\nContinue?";
		var previousSeats = theTalk.occupiedSeats;
		theTalk.occupiedSeats = newValueForSeats;
		theTalk.fullyBooked = isFullyBooked(newValueForSeats, theTalk.availableSeats);

		popups.confirm(
			"Confirm Status Change",
			message,
			function() {
				store.loading = true;
				scroll.save();
				request.update(
					theTalk,
					function() {
                        loadTalks();
					},
					function(err) {
						theTalk.fullyBooked = isFullyBooked(previousSeats, theTalk.availableSeats);
						theTalk.occupiedSeats = previousSeats;
						onError(err);
					},
					store.token
				);
			},
			function() {
				theTalk.fullyBooked = isFullyBooked(previousSeats, theTalk.availableSeats);
				theTalk.occupiedSeats = previousSeats;
				console.log("aborted");
			}
		);
	}

	function confirmAndUpdateOccupiedSeats(event) {
		var id = event.currentTarget.getAttribute("data-id");
		var theTalk = computed.talks()[id];
		var newValue = document.querySelector("input[data-id='" + id +"']").value;
		if (!store.loggedIn) {
			popups.alert("Please Log In", "You must be logged in to do this.");
			document.querySelector("input[data-id='" + id +"']").value = theTalk.occupiedSeats;
			return;
		}

		confirmAndUpdate(theTalk, newValue)
	}

	function confirmAndToggleFull(event) {
		var id = event.currentTarget.getAttribute("data-id");
		var theTalk = computed.talks()[id];
		if (!store.loggedIn) {
			popups.alert("Please Log In", "You must be logged in to do this.");
			setTimeout(function() {
				theTalk.fullyBooked = !theTalk.fullyBooked;
			}, 50);
			return;
		}

		setTimeout(function() {
			var newValueForSeats = theTalk.fullyBooked ? theTalk.availableSeats : 0;
			document.querySelector("input[data-id='" + id +"']").value = newValueForSeats;
			confirmAndUpdate(theTalk, newValueForSeats);
		}, 50);
	}
	
	function loadTalks() {
		store.loading = true;
		store.quickFilter = "";
		request.get(prepareData, onError);
	}
	
	function prepareData(result) {
		var entries = result.events;
		
		entries.forEach(function(entry) {
			helper.enrichData(entry, result.metaData);
		});
		
		store.allTalks = entries || [];
		store.loading = false;
		store.error = false;
		scroll.restore();
	}
	
	function onError(error) {
		console.log(error);
		popups.alert("Error", "There was an error: " + (error && error.status ? error.status: JSON.stringify(error, null, " ").replace(/\n/g, "<br>")));
		store.loading = false;
		store.updating = false;
		store.error = computed.talks().length === 0;
	}
	
	return {
		emptyOnEsc: emptyOnEsc,
		update: confirmAndUpdateOccupiedSeats,
		toggleFull: confirmAndToggleFull,
        forceUpdate: forceUpdate,
		refresh: loadTalks
	}
});