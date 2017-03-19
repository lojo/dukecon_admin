define(['dummy'], function(dummy) {
    return {
        get: function(onSuccess, onError) {
            setTimeout(function() {
                if (onSuccess) {
                    onSuccess(dummy);
                }
            }, 1000);
        },
        update: function(data, onSuccess, onError) {
            setTimeout(function() {
                if (onSuccess) {
                    console.log("Dummy update done.");
                    onSuccess();
                }
            }, 1000);
        }
    }
});