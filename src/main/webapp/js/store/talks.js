define(['store', 'computed', 'request', 'popups', 'dataHelper', 'scrollHelper'], function(store, computed, request, popups, helper, scroll) {
	function emptyOnEsc(e) {
		if (e.keyCode === 27) { // escape key maps to keycode `27`
			store.quickFilter = "";
		}
	}
	
	function sendWithBearer(event) {
		event.preventDefault();
		store.updating = true;
		var href = event.currentTarget.href;
		console.log(href);
		request.getWithToken(href, store.token, function(result) {
			popups.alert("Refresh Data", "Success!", function() {
				store.updating = false;
			});
		}, onError);
	}
	
	function confirmAndUpdate(event) {
		var id = event.currentTarget.id;
		var theTalk = computed.talks()[id];
		if (!store.loggedIn) {
			popups.alert("Please Log In", "You must be logged in to do this.");
			theTalk.fullyBooked = !theTalk.fullyBooked;
			return;
		}
		
		var status = theTalk.fullyBooked ? "Fully booked" : "Free";
		var message = "<span>Room: </span><em class=\"dark\">"
			+ theTalk.roomName
			+ "</em>\n<span>Time: </span><em class=\"dark\">" + theTalk.formattedStart
			+ "</em>\n\n<span>New Status: </span><em class=\"" + status.replace(" ", "") + "\">"
			+ status
			+ "</em>\n\nContinue?";
		
		popups.confirm(
			"Confirm Status Change",
			message,
			function() {
				store.loading = true;
				scroll.save();
				request.update(
					theTalk,
					function() {
						store.loading = false;
					},
					function(err) {
						theTalk.fullyBooked = !theTalk.fullyBooked;
						onError(err);
					},
					store.token
				);
				loadTalks();
			},
			function() {
				theTalk.fullyBooked = !theTalk.fullyBooked;
				console.log("aborted");
			}
		);
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
		update: confirmAndUpdate,
		sendWithBearer: sendWithBearer,
		refresh: loadTalks
	}
});