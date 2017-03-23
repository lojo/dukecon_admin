define(['vue', 'popups', 'dataHelper', 'scrollHelper'], function(Vue, popups, helper, scroll) {
    "use strict";

    var request = null, app = null;

    function quickFilterTalks(e) {
		if (e.keyCode == 27) { // escape key maps to keycode `27`
			app.quickFilter = "";
		}
		app.talks = app.allTalks;
		var filterBy = app.quickFilter.toLowerCase();
    	if (filterBy.length >= 2) {
			app.talks = app.allTalks.filter(function(talk) {
				var freeOrFull = false;
				if (filterBy === "fr" || filterBy === "fre" || filterBy === "free") {
					freeOrFull = freeOrFull || !talk.fullyBooked;
				}
				if (filterBy === "fu" || filterBy === "ful" || filterBy === "full") {
					freeOrFull = freeOrFull || talk.fullyBooked;
				}
				return freeOrFull ||
					talk.title.toLowerCase().indexOf(filterBy) >=0 ||
					talk.roomName.toLowerCase().indexOf(filterBy) >=0 ||
					talk.formattedStart.toLowerCase().indexOf(filterBy) >=0;
			});
		}
	}
     
    function prepareData(result) {
        var entries = result.events;

        entries.forEach(function(entry) {
            helper.enrichData(entry, result.metaData);
        });

        app.talks = entries || [];
        app.allTalks = entries || [];
        app.loading = false;
        app.error = false;
        scroll.restore();
    }

    function onError(error) {
        console.log(error);
        popups.alert("Error", "There was an error: " + (error && error.status ? error.status: error));
        app.loading = false;
        app.error = app.talks.length === 0;
    }
	
	function loadTalks() {
		app.loading = true;
		app.quickFilter = "";
		request.get(prepareData, onError);
	}

    function confirmAndUpdate(event) {
		var id = event.currentTarget.id;
        if (!app.loggedIn) {
            popups.alert("Please Log In", "You must be logged in to do this.");
			app.talks[id].fullyBooked = !app.talks[id].fullyBooked;
            return;
        }

        var status = app.talks[id].fullyBooked ? "Fully booked" : "Free";
        var message = "<span>Room: </span><em class=\"dark\">"
            + app.talks[id].roomName
            + "</em>\n<span>Time: </span><em class=\"dark\">" + app.talks[id].formattedStart
            + "</em>\n\n<span>New Status: </span><em class=\"" + status.replace(" ", "") + "\">"
            + status
            + "</em>\n\nContinue?";

        popups.confirm(
            "Confirm Status Change",
            message,
            function() {
                app.loading = true;
                scroll.save();
                request.update(app.talks[id], function() { app.loading = false }, onError);
                loadTalks();
            },
            function() {
                app.talks[id].fullyBooked = !app.talks[id].fullyBooked;
                console.log("aborted");
            }
        );
    }

    function initialize(req, authData) {
        request = req;
	
		app = new Vue({
            el: "#main",
            data: {
                talks: [],
                allTalks: [],
                quickFilter: "",
				quickFilterTalks: quickFilterTalks,
                update: confirmAndUpdate,
                refresh: loadTalks,
                loading: true,
                error: false,
                loggedIn: authData.loggedIn
            }
        });

        loadTalks();
        console.log("App initialized");
    }

    return {
        initialize: initialize
    };
});