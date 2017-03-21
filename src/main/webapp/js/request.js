define(['dataHelper'], function (helper) {
    "use strict;"

    var conferenceUrl = null, bookingsUrl = null, adminUrl = null, errorState = false;

    function isInitialized() {
        return (conferenceUrl !== null && bookingsUrl !== null && adminUrl !== null) || errorState;
    }

    function httpRequest(url, method, onSuccess, onError) {
        if (errorState) {
            if (onError) {
                onError({status: 0, statusMessage: "error during initializiation"});
            }
            return;
        }
        console.log(method + " " + url);
        var xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status >= 200 && status <= 202 && onSuccess) {
                    onSuccess(this.response ? JSON.parse(this.response) : null);
                } else if (onError) {
                    onError(this);
                }
            }
        };
        xhttp.send();
    }

    function initialize(callback) {
        httpRequest(
            "init.json",
            "GET",
            function (result) {
                conferenceUrl = result.conferences;
                bookingsUrl = result.events;
                adminUrl = result.admin || "";
                adminUrl = adminUrl.replace(/\/$/ig, ""); // make sure there is no space at the end
                errorState = false;
                if (callback) {
                    callback();
                }
                console.log("Requests initialized");
            },
            function () {
                console.log("Error during initialization!");
                errorState = true;
            }
        );
    }

    function getDelta(conference, onSuccess, onError) {
        httpRequest(
            bookingsUrl,
            "GET",
            function (result) {
                result.events = helper.addDeltaToConferences(conference.events, result);
                onSuccess(conference);
            },
            onError
        );
    }

    function getConferences(onSuccess, onError) {
        function doRequest() {
            httpRequest(
                conferenceUrl,
                "GET",
                onSuccess,
                onError
            );
        }

        if (!isInitialized()) {
            initialize(doRequest);
        } else {
            doRequest();
        }

    }


    function getList(onSuccess, onError) {
        getConferences(
            function (result) {
                result.events = helper.filterAndSortEvents(result.events);
                getDelta(result, onSuccess, onError)
            },
            onError
        );
    }

    function update(talk, onSuccess, onError) {
        if (!isInitialized()) {
            initialize();
        }
        httpRequest(adminUrl + "/" + talk.id, talk.fullyBooked ? "POST" : "DELETE", onSuccess, onError);
    }

    return {
        get: getList,
        update: update
    };
});