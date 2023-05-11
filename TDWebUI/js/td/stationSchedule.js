var scheduleStationLink;    // TODO: make local to the view instance

// update left panel of Station Schedule view
function updateStationSchedule() {
    var schedFilter = $('#stationSelectorSearchInput').val();
    $('#stationSelectorSearchInput').on('input', function() {
        schedFilter = $(this).val(); // get the current value of the input field.
        updateStationScheduleList(schedFilter);
    });
    updateStationScheduleList(schedFilter);
}

function updateStationScheduleList(filtr) {
	$.getJSON( "/war/stations.json", function( data ) {
		var items = [];
		var i;
		for(i = 0; i < data.stations.length; ++i) {
		    var val = data.stations[i];
		    if(filtr && filtr.length > 0 && val.name.indexOf(filtr) < 0)
		        continue;
			items.push("<li class='stationListItem' onclick='selectedStationItem(\"" + val.link + "\", " + i + ");'>" + val.name + "</li>\n");
		};
		$("#stationSelector").html(items.join(""));

	}).fail(function() {
		console.log("fail");
	});
}

function selectStationInList(name) {
    var i = 0;
	$(".stationListItem").each(function() {
		if(i == name) {
			this.style.color = "blue";
			$(this).css("font-weight", "bold")
		} else {
			this.style.color = "black";
			$(this).css("font-weight", "normal")
		}
		++i;
	});
}
//update right panel of Station Schedule view
function selectedStationItem(link, name) {
    scheduleStationLink = link;
	selectStationInList(name);
	var schedFilter = $('#statSchedSearchInput').val();
    $('#statSchedSearchInput').on('input', function() {
        schedFilter = $(this).val(); // get the current value of the input field.
        updateTrainsStopping(schedFilter);
    });
    updateTrainsStopping(schedFilter);
}

function updateTrainsStopping(filtr) {
    
	$.getJSON( "/war/sched.json?s=" + scheduleStationLink, function( data ) {
		var items = [];
		$.each(data.schedule, function( key, val ) {
		    if(filtr.length > 0) {
		        if(val.train.indexOf(filtr) < 0 &&
                    val.arrival.indexOf(filtr) < 0 &&
                    val.entrance.indexOf(filtr) < 0 &&
                    val.departure.indexOf(filtr) < 0 &&
                    val.exit.indexOf(filtr) < 0) {
		            return;
		        }
		    }
			items.push("<tr onclick='selectedTrainStops(\"" + val.train + "\", \"" + val.trainlink + "\");'><td>" +
					val.train + "</td><td>" + val.arrival + "</td><td>" + val.entrance + "</td><td>" +
					val.departure + "</td><td>" + val.exit + "</td><td>" + val.days + "</td><td>" + val.platform + "</td></tr>");
		});
        $("#stTrainsTable").colResizable({liveDrag: true, postbackSafe: true });
		$("#stTrainsTable tbody").html(items.join("\n"));
	}).fail(function() {
		console.log("fail /war/sched.json?s=" + scheduleStationLink);
	});
}

