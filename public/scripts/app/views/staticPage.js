// The backbone router
define([
    'underscore',
    'jquery',
    'backbone'
],
    function(
        _,
        $,
        Backbone) {

        var publics = {};

        publics.StaticView = Backbone.View.extend({

            initialize: function(options){
                this.tmpl = options.tmpl;
            },

            render: function(){
                this.$el.html(this.tmpl);
            }
        });

        return publics.StaticView;
    });