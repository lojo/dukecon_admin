define(['vue', 'popups', 'dataHelper', 'scrollHelper', 'store', 'methods'], function(Vue, popups, helper, scroll, store, methods) {
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
			computed: methods.computed
        });

        methods.methodsForTalks.refresh();
        console.log("App initialized");
    }

    return {
        initialize: initialize
    };
});