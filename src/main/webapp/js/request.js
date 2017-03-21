define(['dummy', 'dataHelper'], function(dummy, helper) {

    function getDelta(result, onSuccess, onError) {
		console.log("Dummy getDelta done.");
		onSuccess(result);
    }
    
    function getList(onSuccess, onError) {
	
		var result = JSON.parse(JSON.stringify(dummy));
		result.events = helper.filterAndSortEvents(result.events);
	
		setTimeout(function() {
			getDelta(result, function() {
				if (onSuccess) {
					onSuccess(result);
				}
			});
		}, 1000);
	}
	
	function update(talk, onSuccess, onError) {
		if (onSuccess) {
			console.log("Dummy update done.");
			onSuccess();
		}
	}
    
    return {
        get: getList,
        update: update
    }
});