define(['dataHelper'], function (helper) {
    "use strict";

	var urls = {
		conferenceUrl: null,
		bookingsUrl: null,
		adminUrl: null,
		keyCloakUrl: null,
		errorState: false
	};

    function isInitialized() {
        return (urls.conferenceUrl !== null && urls.bookingsUrl !== null && urls.adminUrl !== null && urls.keyCloakUrl !== null) || urls.errorState;
    }

    function httpRequest(url, method, onSuccess, onError, headers) {
        if (urls.errorState) {
            if (onError) {
                onError({status: 0, statusMessage: "error during initializiation"});
            }
            return;
        }

        console.log(method + " " + url);
        var xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);

        if (headers) {
            var key, headerKeys = Object.keys(headers);
            for (key in headerKeys) {
                xhttp.setRequestHeader(headerKeys[key], headers[headerKeys[key]]);
            }
        }

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                console.log("Request returned " + this.status);
                if (this.status >= 200 && status <= 205 && onSuccess) {
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
                urls.keyCloakUrl = result.keycloak;
				urls.conferenceUrl = result.conferences;
				urls.bookingsUrl = result.events;
				urls.adminUrl = result.admin || "";
				urls.adminUrl = urls.adminUrl.replace(/\/$/ig, ""); // make sure there is no space at the end
				urls.errorState = false;
                if (callback) {
                    callback(urls);
                }
                console.log("Requests initialized");
            },
            function () {
                console.log("Error during initialization!");
				urls.errorState = true;
            }
        );
    }

    function getDelta(conference, onSuccess, onError) {
        httpRequest(
			urls.bookingsUrl,
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
				urls.conferenceUrl,
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

    function update(talk, onSuccess, onError, keycloakToken) {
        if (!isInitialized()) {
            initialize();
        }

        var headers = {};
        if (keycloakToken) {
            headers.Authorization = "Bearer " + keycloakToken;
        }
        httpRequest(urls.adminUrl + "/" + talk.id, talk.fullyBooked ? "POST" : "DELETE", onSuccess, onError, headers);
    }

    return {
		initialize : initialize,
        get: getList,
        update: update
    };
});