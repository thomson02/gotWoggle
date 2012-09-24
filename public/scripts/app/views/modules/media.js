// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/modules/media.html',
    'colorbox'
],
    function(
        _,
        $,
        Backbone,
        template) {

        var publics = {};

        publics.mediaModuleView = Backbone.View.extend({

            events: {
                'click a.page': 'changePage',
                'click a.prev': 'prevPage',
                'click a.next': 'nextPage',
                'click div.thumbnailImg': 'colorboxImg',
                'click div.thumbnailVid': 'colorboxVid'
            },

            colorboxVid: function(e){
                var groupName = $(e.currentTarget).siblings("div:last").find("a:first").attr("class").replace("youtube ", "");
                $("." + groupName).colorbox({
                    rel: groupName,
                    iframe: true,
                    innerWidth: 425,
                    innerHeight: 344,
                    open: true,
                    onClosed: function(){
                        $.colorbox.remove();
                    }
                });
            },

            colorboxImg: function(e) {
                var groupName = $(e.currentTarget).siblings("div:last").find("a:first").attr("class");
                $("." + groupName).colorbox({
                    rel: groupName,
                    open: true,
                    onClosed: function(){
                        $.colorbox.remove();
                    }
                });
            },

            prevPage: function(e) {
                e.preventDefault();
                this.pager.currentPage--;
                this.fetchMedia();
            },

            nextPage: function(e) {
                e.preventDefault();
                this.pager.currentPage++;
                this.fetchMedia();
            },

            changePage: function(e){
                e.preventDefault();
                this.pager.currentPage = parseInt(this.$(e.currentTarget).text()) - 1;
                this.fetchMedia();
            },

            initialize: function(options){
                this.section = options.section;
                this.fetchUrl = "/api/media/";

                this.mediaData = new Backbone.Model({ lastPage: null, pageSize: null, results: null });

                this.pager = {
                    currentPage: 0,
                    adjacents: 3
                };

                _.bindAll(this, 'changePage', 'prevPage', 'nextPage');
                this.mediaData.bind("change", this.render, this);
            },

            fetchMedia: function(){
                var that = this;
                that.mediaData.set({ results: null });
                $.getJSON(this.fetchUrl + this.section + "/" + this.pager.currentPage, function(data){
                    that.mediaData.set(data);
                });
            },

            getButtons: function() {
                var buttons = [];
                if (this.mediaData.get('results') === null || this.mediaData.get('results').length === 0) { return buttons; }

                // check left
                for (var i = Math.max(0, this.pager.currentPage - this.pager.adjacents); i < this.pager.currentPage; i++) {
                    buttons.push({ PageNumber: i, IsCurrent: false });
                }

                // current button
                buttons.push({ PageNumber: this.pager.currentPage, IsCurrent: true });

                // check right
                if (this.pager.currentPage != this.mediaData.get('lastPage')) {
                    for (var j = this.pager.currentPage + 1; j <= Math.min(this.mediaData.get('lastPage'), this.pager.currentPage + this.pager.adjacents); j++) {
                        buttons.push({ PageNumber: j, IsCurrent: false });
                    }
                }

                return buttons;
            },

            render: function(){
                this.$el.html(_.template(template, { buttons: this.getButtons(), mediaData: this.mediaData.toJSON(), pager: this.pager }));
                return this;
            }
        });

        return publics.mediaModuleView;
    });