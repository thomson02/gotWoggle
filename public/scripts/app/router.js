// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'app/views/staticPage',
    'app/views/sectionPage',
    'text!app/templates/homePage.html',
    'text!app/templates/groupPages/people.html',
    'text!app/templates/groupPages/heartstart.html',
    'text!app/templates/groupPages/history.html',
    'bootstrap'
],
    function(
        _,
        $,
        Backbone,
        StaticPage,
        SectionPageView,
        HomePageTemplate,
        PeopleTemplate,
        HeartStartTemplate,
        HistoryTemplate) {

        var AppView = {
            currentView: null,
            render: function(view) {

                if (this.currentView) {
                    this.currentView.close();
                }

                this.currentView = view;
                this.currentView.render();
            }
        };

        var AppRouter = Backbone.Router.extend({
            routes: {
                'beavers': 'beavers',
                'cubs': 'cubs',
                'scouts': 'scouts',
                'explorers': 'explorers',
                'group/history': 'history',
                'group/people': 'people',
                'group/heartstart': 'heartstart',
                'group': 'group',
                'media': 'media',
                '*actions': 'defaultAction'
            },

            initialize: function() {
                this.appView = AppView;
                $('.dropdown-toggle').dropdown();
            },

            homepage: function() {
                this.appView.render(new StaticPage({ el: $("#main-container"), tmpl: HomePageTemplate }));
            },

            beavers: function() {
                this.appView.render(new SectionPageView({ el: $("#main-container"), section: "beavers" }));
            },

            cubs: function() {
                this.appView.render(new SectionPageView({ el: $("#main-container"), section: "cubs" }));
            },

            scouts: function() {
                this.appView.render(new SectionPageView({ el: $("#main-container"), section: "scouts" }));
            },

            explorers: function() {
                this.appView.render(new SectionPageView({ el: $("#main-container"), section: "explorers" }));
            },

            group: function(){

            },

            media: function(){

            },

            people: function(){
                this.appView.render(new StaticPage({ el: $("#main-container"), tmpl: PeopleTemplate }));
            },

            heartstart: function() {
                this.appView.render(new StaticPage({ el: $("#main-container"), tmpl: HeartStartTemplate }));
            },

            history: function() {
                this.appView.render(new StaticPage({ el: $("#main-container"), tmpl: HistoryTemplate }));
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