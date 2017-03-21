define(['vue', 'popups', 'dataHelper'], function(Vue, popups, helper) {

    var request = null, app = null, initialized = false;

    function prepareData(result) {
        var entries = result.events;

        entries.forEach(function(entry) {
            helper.enrichData(entry, result.metaData);
        });

        app.talks = entries;
        app.loading = false;
        app.error = false;
    }

    function onError(error) {
        console.log(error);
        app.loading = false;
        app.error = true;
    }
	
	function loadTalks() {
		app.loading = true;
		request.get(prepareData, onError);
	}

    function confirmAndUpdate(event) {
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
                request.update(app.talks[id], function() { app.loading = false }, onError);
                loadTalks();
            },
            function() {
                app.talks[id].fullyBooked = !app.talks[id].fullyBooked;
                console.log("aborted");
            }
        );
    }
    
    function initialize(req) {
        request = req;
        app = new Vue({
            el: "main",
            data: {
                talks: {},
                update: confirmAndUpdate,
                refresh: loadTalks,
                loading: true,
                error: false
            }
        });
        initialized = true;
        
        loadTalks();
        console.log("Initialized");
    }

    return {
        initialize: initialize
    };
});