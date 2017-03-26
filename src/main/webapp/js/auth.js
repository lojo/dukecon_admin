define(['vue', 'keycloak'], function (Vue, Keycloak) {
    "use strict";

    var keycloakAuth = null;
    var enforceLogin = false;

    var logout = function () {
        keycloakAuth.logout().success(function () {
            data.loggedIn = false;
            data.token = null;
        }).error(function () {
            console.log("WTF");
        });
    };

    var login = function () {
        keycloakAuth.login()
            .success(function () { data.loggedIn = true; })
            .error  (function () { data.loggedIn = false; });
    };

    var data = new Vue({
        el: "#login-area",
        data: {
            loginAvailable: true,
            loggedIn: false,
            login: login,
            logout: logout,
            token: null
        }
    });

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
    
    function initKeyCloak(vueApp, callback) {
        // issue I had: when KC init encounters an error 400, neither success nor error get called
        keycloakAuth.init({
            onLoad: enforceLogin ? "login-required" : "check-sso"
        }).success(function (authenticated) {
            vueApp.loggedIn = authenticated;
            console.log('Authenticated: ' + authenticated);
            if (authenticated) {
                data.token = keycloakAuth.token;
                console.log('local time: ' + new Date().getTime() / 1000);
                console.log('iat: ' + keycloakAuth.tokenParsed.iat);
                console.log('diff: ' + (new Date().getTime() / 1000 - keycloakAuth.tokenParsed.iat));
                console.log('exp in: ' + (keycloakAuth.tokenParsed.exp - new Date().getTime() / 1000));
                console.log('isExpired: ' + keycloakAuth.isTokenExpired());
                window.setInterval(function () {
                    keycloakAuth.updateToken(15).success(function () {
                        data.token = keycloakAuth.token;
                        vueApp.token = keycloakAuth.token;
                        console.info('updateToken success.')
                    }).error(function () {
                        console.error('Fehler beim Aktualisieren des Keycloak-Tokens')
                    })
                }, 10000);
            }
            if (callback) {
                callback(data);
            }
        }).error(function (err) {
            vueApp.loginAvailable = false;
            data.token = null;
            console.log("Error initializing keycloak");
            console.log(err);
            if (callback) {
                callback(data);
            }
        });
    }

    function initialize(keyCloakUrl, callback) {
		keycloakAuth = new Keycloak(keyCloakUrl);
        registerCallbacks();
		initKeyCloak(data, callback);
        console.log("Auth initialized");
    }

    return {
        initialize: initialize,
        data: data
    };
});