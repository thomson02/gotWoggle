// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/sectionPages/beaversPage.html',
    'text!app/templates/sectionPages/cubsPage.html',
    'text!app/templates/sectionPages/scoutsPage.html',
    'text!app/templates/sectionPages/explorersPage.html'
],
    function(
        _,
        $,
        Backbone,
        BeaversTemplate,
        CubsTemplate,
        ScoutsTemplate,
        ExplorersTemplate
        ) {

        var templateMap = {
            "beavers": BeaversTemplate,
            "cubs": CubsTemplate,
            "scouts": ScoutsTemplate,
            "explorers": ExplorersTemplate
        }

        var sectionPageView = Backbone.View.extend({

            initialize: function(options){
                this.section = options.section;
            },

            render: function(){
                this.$el.html(templateMap[this.section]);

                return this;
            }
        });

        return sectionPageView;
    });