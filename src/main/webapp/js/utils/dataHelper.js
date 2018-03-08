define(['moment'], function(moment) {
	"use strict";
	
	function filterPastEvents(events) {
		if (!Array.prototype.filter) {
			console.log("filtering is not supported on this browser, sorry!");
			return events;
		}
		var now = new moment();
		function filterByDate(event) {
			return moment(event.end).isAfter(now);
		}
		
		return events.filter(filterByDate);
	}
	
	function sortEventsByDate(events) {
		function sortByStartAscending(event1, event2) {
			if (event1.start > event2.start) {
				return 1;
			}
			return event1.start < event2.start ? -1 : 0;
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

	function getSeats(roomId, rooms) {
		var i;
		for (i = 0; i < rooms.length; i++) {
			if (rooms[i].id === roomId) {
				console.log(rooms[i]);
				return rooms[i].capacity;
			}
		}
		return 0;
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
		//entry.availableSeats = getSeats(entry.locationId, metaData.locations);
	}

    function addDeltaToConferences(events, delta) {
        var i;
        for (i = 0; i < delta.length; i += 1) {
			var event = findByEventId(events, delta[i].eventId);
			if (event) {
				event.fullyBooked = delta[i].fullyBooked;
				event.numberOfFavorites = delta[i].numberOfFavorites;
				event.occupiedSeats = delta[i].numberOccupied;
				event.availableSeats = delta[i].locationCapacity;
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