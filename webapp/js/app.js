define(['vue'], function(Vue) {

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

    function initialize(req) {
        request = req;
        app = new Vue({
            el: "main",
            data: {
                talks: {},
                loading: true,
                error: false
            }
        });
        initialized = true;
        request.get(prepareData, onError);
        console.log("Initialized");
    }

    return {
        app: app,
        initialize: initialize
    };
});