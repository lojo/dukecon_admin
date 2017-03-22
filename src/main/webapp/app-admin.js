require.config({
    baseUrl: "js",

    paths: {
        vue : 'vue.min',
        moment: 'moment-with-locales-2.11.2'
    }
});

require(['app', 'auth', 'request', 'domReady!'], function(app, auth, request) {
    request.initialize(function(urls) {
        auth.initialize(urls.keyCloakUrl, function(authData) {
            app.initialize(request, authData);
        });
    });
});
