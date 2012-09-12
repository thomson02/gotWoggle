// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'app/views/modules/schedule',
    'text!app/templates/sectionPages/beaversPage.html',
    'text!app/templates/sectionPages/cubsPage.html',
    'text!app/templates/sectionPages/scoutsPage.html',
    'text!app/templates/sectionPages/explorersPage.html'
],
    function(
        _,
        $,
        Backbone,
        ScheduleView,
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
                new ScheduleView({ el: this.$("#scheduleContainer"), section: this.section }).render();
                // new EventView({ el: this.$("#eventContainer"), section: this.section }).render();
                // new MediaView({ el: this.$("#mediaContainer"), section: this.section }).render();

                return this;
            }
        });

        return sectionPageView;
    });