// The backbone router
define([
    'underscore',
    'jQueryWithBootstrap',
    'backbone',
    'app/views/sectionPage'
],
    function(
        _,
        $,
        Backbone,
        SectionPageView) {

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
                $('.dropdown-toggle').dropdown();
            },

            homepage: function() {
            },

            beavers: function() {
                new SectionPageView({ el: $("#main-container"), section: "beavers" });
            },

            cubs: function() {
                new SectionPageView({ el: $("#main-container"), section: "cubs" });
            },

            scouts: function() {
                new SectionPageView({ el: $("#main-container"), section: "scouts" });
            },

            explorers: function() {
                new SectionPageView({ el: $("#main-container"), section: "explorers" });
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