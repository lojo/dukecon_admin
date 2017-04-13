define(['store'], function(store) {
	function filterTalks() {
		var talks = store.allTalks;
		var filterBy = store.quickFilter.toLowerCase();
		if (filterBy.length >= 2) {
			talks = store.allTalks.filter(function(talk) {
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
		return talks;
	}
	
	return {
		talks: filterTalks
	}
});