// The backbone router
define([
    'underscore',
    'jQueryWithBootstrap',
    'backbone',
    'text!app/templates/aboutModule/beavers.html',
    'text!app/templates/aboutModule/cubs.html',
    'text!app/templates/aboutModule/scouts.html',
    'text!app/templates/aboutModule/explorers.html'
],
    function(
        _,
        $,
        Backbone,
        beavers,
        cubs,
        scouts,
        explorers) {

        var publics = {};

        publics.aboutModuleView = Backbone.View.extend({

            template: function(){
                var templates = {
                    'beavers': beavers,
                    'cubs': cubs,
                    'scouts': scouts,
                    'explorers': explorers
                };

                this.$el.html(templates[this.section]);
            },

            initialize: function(options){
                this.section = options.section;
            },

            render: function(){
                this.template();
            }
        });

        return publics.aboutModuleView;
    });