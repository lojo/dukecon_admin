require.config({
    baseUrl: "js",

    paths: {
        popups: 'utils/popups',
        scrollHelper: 'utils/scrollHelper',
        dataHelper: 'utils/dataHelper',
        request: 'utils/request',
        vue : 'lib/vue.min',
        moment: 'lib/moment-with-locales-2.11.2',
        keycloak: 'lib/keycloak',
        domReady: 'lib/domReady'
    }
});

require(['app', 'auth', 'request', 'domReady!'], function(app, auth, request) {
    request.initialize(function(urls) {
        auth.initialize(urls.keyCloakUrl, function(authData) {
            app.initialize(request, authData);
        });
    });
});
