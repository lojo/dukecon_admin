require.config({
    baseUrl: "js",

    paths: {
    }
});

require(['domReady!'], function() {
    console.log("dom ready!");

});
