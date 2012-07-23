
// Require.js allows us to configure shortcut alias
require.config({
    baseUrl: "/scripts",
    paths: {
        jQueryWithBootstrap: 'lib/require/jQueryWithBootstrap',
        underscore: 'lib/underscore/underscore-wrapper',
        backbone: 'lib/backbone/backbone-wrapper',
        text: 'lib/require/plugins/text'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jQueryWithBootstrap']   ,
            exports: 'Backbone'
        }
    }
});

// Initialize the router
require([
    'underscore',
    'jQueryWithBootstrap',
    'backbone',
    'app/router'],
    function(_, $, Backbone, Router) {
        Router.initialize();
    });