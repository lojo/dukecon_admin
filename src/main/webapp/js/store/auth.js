define(['store', 'keycloak'], function (store, Keycloak) {
    "use strict";

    var keycloakAuth = null;
    var enforceLogin = false;

    var logout = function () {
        keycloakAuth.logout().success(function () {
            store.loggedIn = false;
            store.token = null;
        }).error(function () {
            console.log("WTF");
        });
    };

    var login = function () {
        keycloakAuth.login()
            .success(function () { store.loggedIn = true; })
            .error  (function () { store.loggedIn = false; });
    };

    function registerCallbacks() {
		keycloakAuth.onAuthSuccess = function () {
			console.log("Auth Success!!");
		};
	
		keycloakAuth.onAuthRefreshSuccess = function () {
			console.log("Auth Refreshed!!");
		};
	
		keycloakAuth.onAuthLogout = function () {
			console.log("Logged out!!");
		};
    }
    
    function initKeyCloak(callback) {
        // issue I had: when KC init encounters an error 400, neither success nor error get called
        keycloakAuth.init({
            onLoad: enforceLogin ? "login-required" : "check-sso"
        }).success(function (authenticated) {
            store.loggedIn = authenticated;
            console.log('Authenticated: ' + authenticated);
            if (authenticated) {
                store.token = keycloakAuth.token;
                console.log('local time: ' + new Date().getTime() / 1000);
                console.log('iat: ' + keycloakAuth.tokenParsed.iat);
                console.log('diff: ' + (new Date().getTime() / 1000 - keycloakAuth.tokenParsed.iat));
                console.log('exp in: ' + (keycloakAuth.tokenParsed.exp - new Date().getTime() / 1000));
                console.log('isExpired: ' + keycloakAuth.isTokenExpired());
                window.setInterval(function () {
                    keycloakAuth.updateToken(15).success(function () {
                        store.token = keycloakAuth.token;
                        console.info('updateToken success.')
                    }).error(function () {
                        console.error('Fehler beim Aktualisieren des Keycloak-Tokens')
                    })
                }, 10000);
            }
            if (callback) {
                callback();
            }
        }).error(function (err) {
            store.loginAvailable = false;
            store.token = null;
            console.log("Error initializing keycloak");
            console.log(err);
            if (callback) {
                callback();
            }
        });
    }

    function initialize(keyCloakUrl, callback) {
		keycloakAuth = new Keycloak(keyCloakUrl);
        registerCallbacks();
		initKeyCloak(callback);
        console.log("Auth initialized");
    }

    return {
        initialize: initialize,
        login: login,
        logout: logout
    };
});