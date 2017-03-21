define(['moment'], function(moment) {
	
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

	/* ----- Exports -----*/
	function filterAndSortEvents(events) {
		return sortEventsByDate(filterPastEvents(events));
	}
	
	function enrichData(entry, metaData) {
		entry.roomName = getRoomName(entry.locationId, metaData.locations);
		entry.formattedStart = moment(entry.start).format('MMM DD, HH:mm');
	}
	
	return {
		enrichData: enrichData,
		filterAndSortEvents: filterAndSortEvents
	}
});