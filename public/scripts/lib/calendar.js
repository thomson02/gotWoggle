(function( $ ) {
  $.fn.calendar = function(url, param) {
  
  	// Constants
	var elem = this;
	var dateViewing;
	var eventUrl = url;
	var eventParam = param;
	var months = new Array('January','February','March','April','May','June','July','August','September','October','November','December');
  

	function InitControlEvents() {
		$("#monthPrev").click(function(){ DrawCalendarContents(new Date(dateViewing.getFullYear(), dateViewing.getMonth() - 1, dateViewing.getDate())); });
		$("#today").click(function(){ DrawCalendarContents(new Date()); });
		$("#monthNext").click(function(){ DrawCalendarContents(new Date(dateViewing.getFullYear(), dateViewing.getMonth() + 1, dateViewing.getDate())); });
	}

    function ConvertDate(myDate){
        return (myDate.getFullYear() + ('0' + (myDate.getMonth()+1)).slice(-2) + ('0' + myDate.getDate()).slice(-2));
    }

	function GetAndPopulateCalendarEvents(fromDate, toDate){
		if ((eventUrl != undefined) && (eventParam != undefined)){
			// placeholder
			$.getJSON(eventUrl, { method: 'getEvents', params: { startDate: ConvertDate(fromDate), endDate: ConvertDate(toDate), section: eventParam } }, function(data){
				$.each(data, function(key, val) { 
				  AddEvent(val);
				});
				
			}).error(function() { console.log("Error: Could not retrieve calendar events."); });
		}
	}
	
	function AddEvent(data){
		data.cargo = $.parseJSON(data.cargo);

        var message = data.title;
        if (data.text.length > 0) { message = '<a href="event.html?id=' + data.id + '" style="color:white;">' + message + '</a>'; }
		var html = '<span class="label ' + data.type + '" style="display: block; white-space: normal; margin-bottom: 3px;">' + message + '</span>';

        var startDay = parseInt(data.startDate.substr(data.startDate.length-2));
        var endDay = parseInt(data.endDate.substr(data.endDate.length-2));
        for (var d=startDay; d <= endDay; d++){
            $("#cal" + d).append(html);
        }
	}
	
	function DrawCalendarContents(date){
		dateViewing = date;
		var prev_month = new Date(date.getFullYear(), date.getMonth()-1, 0);
		var this_month = new Date(date.getFullYear(), date.getMonth(), 0);
  		var next_month = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		var today = new Date();
		
		// Find out when this month starts and ends.
  		var first_week_day = this_month.getDay() ;
  		var days_in_this_month = Math.round((next_month.getTime() - this_month.getTime()) / (1000 * 60 * 60 * 24));
		var days_in_prev_month = Math.round((this_month.getTime() - prev_month.getTime()) / (1000 * 60 * 60 * 24));
		
		// Update the current month/year tag
		$("#currentMonth").text(months[date.getMonth()] + " " + date.getFullYear());
		
		// Fill the first week of the month with the appropriate number of blanks.
		var calendar_html = '<tr>';
    	for (week_day = 0; week_day < first_week_day; week_day++) { calendar_html += '<td style="width: 14%; height: 70px;"><div class="dayCounter" align="right" style="color: #ccc;">'+ (days_in_prev_month - first_week_day + week_day + 1) +'</div></td>'; }
		
		var week_day = first_week_day;
		for (day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
			week_day %= 7;
			if(week_day == 0) { calendar_html += '</tr><tr>'; }
			var style = "";
			if ((date.getDate() == day_counter) && (date.getMonth() == today.getMonth()) && (date.getFullYear() == today.getFullYear())) { style="background-color: #FEE9CC;"; }
			calendar_html += '<td style="text-align: center; width:14%; height: 70px; '+style+'"><div><div class="dayCounter" align="right">' + day_counter + '</div><div id="cal' + day_counter + '"></div></div></td>'; 
			week_day++;
		}
		
		var extraDayCount = 0;
		for ( var d = (days_in_this_month + first_week_day); d < 42; d++){ 
			if (d%7 == 0){ calendar_html += '</tr><tr>'; }
			calendar_html += '<td style="width: 14%; height: 70px;"><div class="dayCounter" align="right" style="color: #ccc;">'+ (++extraDayCount) +'</div></td>'; 
		}
		calendar_html += '</tr>'
		
		$("#calendarContents").html(calendar_html);
		GetAndPopulateCalendarEvents(this_month, next_month);
	}

	DrawControls();
	InitControlEvents();
	DrawCalendarSkeleton();
	DrawCalendarContents(new Date());

  };
})( jQuery );