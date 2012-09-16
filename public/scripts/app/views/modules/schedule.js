// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/modules/schedule.html',
    'text!app/templates/modules/eventModal.html',
    'bootstrap'
],
    function(
        _,
        $,
        Backbone,
        template,
        modalTemplate) {

        var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

        var scheduleView = Backbone.View.extend({

            events: {
                'click button.prev': 'prevMonth',
                'click button.today': 'today',
                'click button.next': 'nextMonth',
                'click span.hasDialog': 'showEvent',
                'click div.modal-footer a': 'closeEventModal'
            },

            closeEventModal: function(e){
                e.preventDefault();
                $("#scheduleModal div.modal").modal("hide");
            },

            showEvent: function(e) {
                var eventDetails = _.find(this.currentDataset, function(ds) { return $(e.currentTarget).attr("class").indexOf("event" + ds._id) >= 0; });
                this.$("#scheduleModal").html(_.template(modalTemplate, eventDetails));
                $("#scheduleModal div.modal").modal();
            },

            prevMonth: function(){
                this.dateViewing.setMonth(this.dateViewing.getMonth() - 1);
                this.render();
            },

            today: function(){
                this.dateViewing = new Date();
                this.dateViewing.setDate(1);
                this.render();
            },

            nextMonth: function() {
                this.dateViewing.setMonth(this.dateViewing.getMonth() + 1);
                this.render();
            },

            initialize: function(options){
                this.section = options.section;
                this.fetchUrl = "/api/schedule/" + this.section + "/";

                _.bindAll(this, 'showEvent');

                this.dateViewing = new Date();
                this.dateViewing.setDate(1);
                this.currentDataset = null;
            },

            render: function(){
                var that = this;
                var daysInPrevMonth = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth(), 0).getDate();
                var daysInThisMonth = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth()+1, 0).getDate();
                var daysBefore = (this.dateViewing.getDate() - this.dateViewing.getDay()) * -1;
                var daysAfter = 42 - daysBefore - daysInThisMonth;

                function convert(d, activeMonth, thisMonth){
                    return {
                        date: d,
                        activeMonth: activeMonth,
                        today: thisMonth && new Date().getDate() === d
                    }
                }

                daysBefore = _.map(_.range((1 + daysInPrevMonth) - daysBefore, daysInPrevMonth + 1), function(d) { return convert(d, false, false); });
                daysInThisMonth = _.map(_.range(1, daysInThisMonth + 1), function(d) { return convert(d, true, that.dateViewing.getMonth() === new Date().getMonth() && that.dateViewing.getFullYear() === new Date().getFullYear()) ; });
                daysAfter = _.map(_.range(1, daysAfter + 1), function(d) { return convert(d, false, false); });

                this.$el.html(_.template(template, {
                    calendarTitle: months[this.dateViewing.getMonth()] + " " + this.dateViewing.getFullYear(),
                    days: daysBefore.concat(daysInThisMonth, daysAfter)
                }));

                this.getAndPopulateEvents();
            },

            convertDate: function(myDate){
                return (myDate.getFullYear() + ('0' + (myDate.getMonth()+1)).slice(-2) + ('0' + myDate.getDate()).slice(-2));
            },

            addEvent: function(data){
                var cssClass = data.htmlBody.length > 0 ? "label " + data.priority : "label hasDialog " + data.priority;
                var html = '<span class="event' + data._id + ' ' + cssClass + '" style="display: block; white-space: normal; margin-bottom: 3px;">' + data.title + '</span>';
                var startDay = parseInt(data.startDate.toString().substr(data.startDate.toString().length-2));
                var endDay = parseInt(data.endDate.toString().substr(data.endDate.toString().length-2));
                for (var d=startDay; d <= endDay; d++){
                    this.$("#schedule" + d).append(html);
                }
            },

            getAndPopulateEvents: function(){
                var that = this;
                var fromDate = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth()-1, 0);
                var toDate = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth(), 0);

                $.getJSON(this.fetchUrl + this.convertDate(fromDate) + "/" + this.convertDate(toDate), function(data){
                    that.currentDataset = data;
                    _.each(data, function(d) { that.addEvent(d); });
                });
            }
        });

        return scheduleView;
    });