// The backbone router
define([
    'underscore',
    'jQueryWithBootstrap',
    'backbone'
],
    function(
        _,
        $,
        Backbone) {

        var AppRouter = Backbone.Router.extend({
            routes: {
                'beavers': 'beavers',
                'cubs': 'cubs',
                'scouts': 'scouts',
                'explorers': 'explorers',
                'group': 'group',
                'media': 'media',
                '*actions': 'defaultAction'
            },

            initialize: function() {
            },

            homepage: function() {
            },

            beavers: function() {

            },

            cubs: function() {

            },

            scouts: function() {

            },

            explorers: function() {

            },

            group: function(){

            },

            media: function(){

            },

            defaultAction: function(actions) {
                console.log('No route:', actions);
                this.homepage();
            }
        });

        var initialize = function(session) {
            var appRouter = new AppRouter();
            Backbone.history.start({});
            return appRouter;
        };

        return {
            initialize: initialize
        };
    });