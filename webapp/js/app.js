define(['vue', 'moment', 'popups'], function(Vue, moment, popups) {

    var request = null, app = null, initialized = false;

    function getRoomName(roomId, rooms) {
        var i;
        for (i = 0; i < rooms.length; i++) {
            if (rooms[i].id === roomId) {
                return rooms[i].names.en;
            }
        }
        return "unknown";
    }

    function prepareData(result) {
        var entries = result.events;

        entries.forEach(function(entry) {
            entry.roomName = getRoomName(entry.locationId, result.metaData.locations);
            entry.formattedStart = moment(entry.start).format('MMM DD, HH:mm');
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

    function confirmAndUpdate(event) {
        var id = event.currentTarget.id;

        var message = "Room: "
            + app.talks[id].roomName
            + "\nTime: " + app.talks[id].formattedStart
            + "\n\nNew Status: "
            + (app.talks[id].fullyBooked ? "Fully booked" : "Free")
            + "\n\nContinue?";

        popups.confirm(
            "Confirm Status Change",
            message,
            function() {
                app.loading = true;
                request.update(app.talks, function() { app.loading = false }, onError);
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
                doUpdate: confirmAndUpdate,
                loading: true,
                error: false
            }
        });
        initialized = true;
        request.get(prepareData, onError);
        console.log("Initialized");
    }

    return {
        initialize: initialize
    };
});