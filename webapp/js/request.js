define(['dummy'], function(dummy) {
    return {
        get: function(onSuccess, onError) {
            setTimeout(function() {
                if (onSuccess) {
                    onSuccess(dummy);
                }
            }, 2000);
        },
        update: function(onSuccess, onError) {
            console.log("Dummy update done.");
        }
    }
});