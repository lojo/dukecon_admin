require.config({
    baseUrl: "js",

    paths: {
        vue : 'vue'
    }
});

require(['app', 'request', 'domReady!'], function(app, request) {
    app.initialize(request);
});
