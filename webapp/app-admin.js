require.config({
    baseUrl: "js",

    paths: {
        vue : 'vue.min',
        moment: 'moment-with-locales-2.11.2'
    }
});

require(['app', 'request', 'domReady!'], function(app, request) {
    app.initialize(request);
});
