// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/mediaModule.html'
],
    function(
        _,
        $,
        Backbone,
        template) {

        var publics = {};

        publics.mediaModuleView = Backbone.View.extend({

            initialize: function(options){
                this.section = options.section;
                //this.fetchUrl =
            },

            render: function(){
                this.$el.html(template);
            }
        });

        return publics.mediaModuleView;
    });