define(['vue', 'store', 'methods', 'computed'], function(Vue, store, methods, computed) {
    "use strict";

    function initialize() {
		new Vue({
			el: "#login-area",
			data: store,
			methods: methods.methodsForAuth
		});
	
		new Vue({
            el: "#main",
            data: store,
			methods:  methods.methodsForTalks,
			computed: computed
        });

        methods.methodsForTalks.refresh();
        console.log("App initialized");
    }

    return {
        initialize: initialize
    };
});