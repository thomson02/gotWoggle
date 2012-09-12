// The backbone router
define([
    'underscore',
    'jquery',
    'backbone',
    'text!app/templates/modules/schedule.html'
],
    function(
        _,
        $,
        Backbone,
        template) {

        var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

        var scheduleView = Backbone.View.extend({

            events: {
                'click button.prev': 'prevMonth',
                'click button.today': 'today',
                'click button.next': 'nextMonth'
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
                this.fetchUrl = "";

                this.dateViewing = new Date();
                this.dateViewing.setDate(1);
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
                data.cargo = $.parseJSON(data.cargo);

                var message = data.title;
                if (data.text.length > 0) { message = '<a href="event.html?id=' + data.id + '" style="color:white;">' + message + '</a>'; }
                var html = '<span class="label ' + data.type + '" style="display: block; white-space: normal; margin-bottom: 3px;">' + message + '</span>';

                var startDay = parseInt(data.startDate.substr(data.startDate.length-2));
                var endDay = parseInt(data.endDate.substr(data.endDate.length-2));
                for (var d=startDay; d <= endDay; d++){
                    this.$("#schedule" + d).append(html);
                }
            },

            getAndPopulateEvents: function(){
                var that = this;
                var fromDate = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth()-1, 0);
                var toDate = new Date(this.dateViewing.getFullYear(), this.dateViewing.getMonth(), 0);

                $.getJSON(this.fetchUrl, { startDate: this.convertDate(fromDate), endDate: this.convertDate(toDate), section: this.section }, function(data){
                    $.each(data, function(key, val) {
                        that.addEvent(val);
                    });
                });
            }
        });

        return scheduleView;
    });