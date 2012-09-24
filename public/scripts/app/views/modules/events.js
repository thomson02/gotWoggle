// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/modules/events.html',
    'text!app/templates/modules/eventModal.html',
    'bootstrap'
],
    function(
        _,
        $,
        Backbone,
        template,
        modalTemplate) {

        var months = new Array('', 'January','February','March','April','May','June','July','August','September','October','November','December');

        var eventsView = Backbone.View.extend({

            events: {
              'click a.page': 'changePage',
              'click a.prev': 'prevPage',
              'click a.next': 'nextPage',
              'click table tr': 'showEvent',
              'click div.modal-footer a': 'closeEventModal'
            },

            closeEventModal: function(e){
                e.preventDefault();
                $("#eventModal div.modal").modal("hide");
            },

            showEvent: function(e) {
                var eventNumber = this.$("table tr").index($(e.currentTarget));
                var eventDetails = this.eventData.get('results')[eventNumber];
                this.$("#eventModal").html(_.template(modalTemplate, eventDetails));
                $("#eventModal div.modal").modal();
            },

            prevPage: function(e) {
                e.preventDefault();
                this.pager.currentPage--;
                this.fetchEvents();
            },

            nextPage: function(e) {
                e.preventDefault();
                this.pager.currentPage++;
                this.fetchEvents();
            },

            changePage: function(e){
                e.preventDefault();
                this.pager.currentPage = parseInt(this.$(e.currentTarget).text()) - 1;
                this.fetchEvents();
            },

            initialize: function(options){
                this.section = options.section;
                this.fetchUrl = "/api/events/";

                this.eventData = new Backbone.Model({ lastPage: null, pageSize: null, results: null });

                this.pager = {
                    currentPage: 0,
                    adjacents: 3
                };

                _.bindAll(this, 'changePage', 'prevPage', 'nextPage', 'showEvent');
                this.eventData.bind("change", this.render, this);
            },

            fetchEvents: function(){
                var that = this;
                $.getJSON(this.fetchUrl + this.section + "/" + this.pager.currentPage, function(data){
                    _.each(data.results, function(d){
                        d.formattedStartDate = months[parseInt(d.startDate.toString().substring(4, 6))] + " " + d.startDate.toString().substring(6, 8);
                        d.formattedEndDate = months[parseInt(d.endDate.toString().substring(4, 6))] + " " + d.endDate.toString().substring(6, 8);
                        d.inFuture = new Date(d.endDate.toString().substring(0, 4), parseInt(d.endDate.toString().substring(4, 6)), d.endDate.toString().substring(6, 8)) >= new Date();
                    });

                    that.eventData.set(data);
                });
            },

            getButtons: function() {
                var buttons = [];
                if (this.eventData.get('results') === null) { return buttons; }

                // check left
                for (var i = Math.max(0, this.pager.currentPage - this.pager.adjacents); i < this.pager.currentPage; i++) {
                    buttons.push({ PageNumber: i, IsCurrent: false });
                }

                // current button
                buttons.push({ PageNumber: this.pager.currentPage, IsCurrent: true });

                // check right
                if (this.pager.currentPage != this.eventData.get('lastPage')) {
                    for (var j = this.pager.currentPage + 1; j <= Math.min(this.eventData.get('lastPage'), this.pager.currentPage + this.pager.adjacents); j++) {
                        buttons.push({ PageNumber: j, IsCurrent: false });
                    }
                }

                return buttons;
            },

            render: function(){
                this.$el.html(_.template(template, { buttons: this.getButtons(), eventData: this.eventData.toJSON(), pager: this.pager }));
                return this;
            }
        });

        return eventsView;
    });