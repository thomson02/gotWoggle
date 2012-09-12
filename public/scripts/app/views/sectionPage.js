// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'app/views/modules/schedule',
    'app/views/modules/events',
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
        EventsView,
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
                var schedule = new ScheduleView({ el: this.$("#scheduleContainer"), section: this.section }).render();

                var events = new EventsView({ el: this.$("#eventContainer"), section: this.section });
                events.render();
                events.fetchEvents();

                // new MediaView({ el: this.$("#mediaContainer"), section: this.section }).render();

                return this;
            }
        });

        return sectionPageView;
    });