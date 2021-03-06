
// Require.js allows us to configure shortcut alias
require.config({
    baseUrl: "/scripts",
    paths: {
        'jquery': 'lib/jquery-1.7.2.min',
        'underscore': 'lib/underscore-1.3.1.min',
        'backbone': 'lib/backbone-0.9.2.min',
        'text': 'lib/require-text-1.0.0.min',
        'bootstrap': 'lib/bootstrap.min'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});

// Initialize the router
require([
    'underscore',
    'jquery',
    'backbone',
    'app/router'],
    function(_, $, Backbone, Router) {

        // Extend Backbone object
        Backbone.View.prototype.close = function() {
            this.$el.empty();   // this.remove();
            this.unbind();
            if (this.onClose) {
                this.onClose();
            }
        };

        Router.initialize();
    });