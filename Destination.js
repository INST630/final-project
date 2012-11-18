var driveTime; //global variable for the driving time, for calculations later
var transitTime; //global variable for the transit time, for calculations


function loadDriveDirections() {
	var directionsReq = {
			origin: document.getElementById("startAddress").value,
			destination: document.getElementById("destination").value,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			provideRouteAlternatives: true,
			avoidTolls: true
		}
		
	var d = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
		
	d.route(directionsReq, function (results) {
		var mapOptions = {
			center: new google.maps.LatLng(38.895111, -77.036667),
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		console.log(results); //debugging
		
		var map = new google.maps.Map(document.getElementById("map_canvas1"), mapOptions);
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
		
		driveTime = results.routes[0].legs[0].duration.value;
		console.log(driveTime); //debugging
		
		timeCalc();
	});
}

function loadTransitDirections() {
	var directionsReq = {
			origin: document.getElementById("startAddress").value,
			destination: document.getElementById("destination").value,
			travelMode: google.maps.TravelMode.TRANSIT,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			provideRouteAlternatives: true,
			avoidTolls: true
		}
		
	var d = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
		
	d.route(directionsReq, function (results) {
		var mapOptions = {
			center: new google.maps.LatLng(38.895111, -77.036667),
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		console.log(results);
		var map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
		
		transitTime = results.routes[0].legs[0].duration.value;
		
		timeCalc();
		
		console.log(transitTime); //debugging
	});
}
	
function timeCalc() { //tells the user which route is faster
	var timeDifference; //the time difference between the two routes
	
	if (driveTime) {
		document.getElementById("timeDiv1").innerHTML = "Driving Route: " + Math.round(driveTime / 60) + " minutes";
	}
	
	if (transitTime) {
		document.getElementById("timeDiv2").innerHTML = "Transit Route: " + Math.round(transitTime / 60) + " minutes";
	}
	
	if(driveTime && transitTime) {
		if (driveTime < transitTime) {
			timeDifference = transitTime - driveTime;
			timeDifference = Math.round(timeDifference / 60); //TODO: figure out how to round value.
			document.getElementById("resultsDiv").innerHTML = "Driving to this destination is faster by " + timeDifference + " minutes.";
		} else if (transitTime < driveTime) {
			timeDifference = driveTime - transitTime;
			timeDifference = Math.round(timeDifference / 60); //TODO: figure out how to round value.
			document.getElementById("resultsDiv").innterHTML = "Taking public transit to this destination is faster by " + timeDiffence + " minutes";
		} else {
			document.getElementById("resultsDiv").innerHTML = "Both routes take the same amount of time.";
		}
	console.log('fuuuuuu', timeDifference);
	}	
}

function onSubmitClick() {
    //alert("CONGRATULATIONS! YOU CLICKED A BUTTON");
    loadDriveDirections();
    loadTransitDirections();
}

function init() {
    document.getElementById("submitForm").onclick = onSubmitClick;
}

window.onload = init;
