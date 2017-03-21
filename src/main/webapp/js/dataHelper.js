define(['moment'], function(moment) {
	"use strict";
	
	function filterPastEvents(events) {
		if (!Array.prototype.filter) {
			console.log("filtering is not supported on this browser, sorry!");
			return events;
		}
		var now = new Date();
		//var now = new Date('2017-03-29T9:00:00.000Z'); // for testing
		function filterByDate(event) {
			return new Date(event.end) > now;
		}
		
		return events.filter(filterByDate);
	}
	
	function sortEventsByDate(events) {
		function sortByStartAscending(event1, event2) {
			return event1.start > event2.start;
		}
		events.sort(sortByStartAscending);
		return events;
	}
	
	function getRoomName(roomId, rooms) {
		var i;
		for (i = 0; i < rooms.length; i++) {
			if (rooms[i].id === roomId) {
				return rooms[i].names.en;
			}
		}
		return "unknown";
	}

	function findByEventId(events, eventId) {
		var i;
		for (i = 0; i < events.length; i += 1) {
			if (events[i].id == eventId) {
                return events[i];
			}
		}
		return null;
	}

	/* ----- Exports -----*/
	function filterAndSortEvents(events) {
		return sortEventsByDate(filterPastEvents(events));
	}
	
	function enrichData(entry, metaData) {
		entry.roomName = getRoomName(entry.locationId, metaData.locations);
		entry.formattedStart = moment(entry.start).format('MMM DD, HH:mm');
	}

    function addDeltaToConferences(events, delta) {
        var i;
        for (i = 0; i < delta.length; i += 1) {
			var event = findByEventId(events, delta[i].eventId);
			if (event) {
				event.fullyBooked = delta[i].fullyBooked;
				event.numberOfFavorites = delta[i].numberOfFavorites;
			}
        }
        return events;
    }

    return {
		enrichData: enrichData,
		filterAndSortEvents: filterAndSortEvents,
        addDeltaToConferences: addDeltaToConferences
	};
});