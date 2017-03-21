define(['vue', 'popups', 'dataHelper', 'scrollHelper'], function(Vue, popups, helper, scroll) {
    "use strict";

    var request = null, app = null;

    function prepareData(result) {
        var entries = result.events;

        entries.forEach(function(entry) {
            helper.enrichData(entry, result.metaData);
        });

        app.talks = entries || [];
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
		request.get(prepareData, onError);
	}

    function confirmAndUpdate(event) {
        if (!app.loggedIn) {
            popups.alert("Please Log In", "You must be logged in to do this.");
            return;
        }
        var id = event.currentTarget.id;

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
            el: "main",
            data: {
                talks: [],
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