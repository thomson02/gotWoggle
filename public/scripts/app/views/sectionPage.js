// The backbone router
define([
    'underscore',
    'jQueryWithBootstrap',
    'backbone',
    'text!app/templates/sectionPage.html',
    'app/views/modules/aboutModule'
],
    function(
        _,
        $,
        Backbone,
        SectionPageTemplate,
        AboutModule) {

        var publics = {};

        publics.sectionPageView = Backbone.View.extend({

            initialize: function(options){
                this.section = options.section;
                this.$el.html(SectionPageTemplate);

                new AboutModule({ el: this.$el.find("div.about"), section: this.section }).render();
            }

        });

        return publics.sectionPageView;
    });