var driveTime; //global variable for the driving time, for calculations later
var transitTime; //global variable for the transit time, for calculations


function loadDriveDirections() { //loads map and results for driving route using the Google Directions API
	var directionsReq = {
			origin: "8191 Strawberry Lane, Falls Church, VA", //set to default for debugging
			destination: "National Gallery of Art, Washington, DC", //set to default for debugging
			//origin: document.getElementById("startAddress").value,
			//destination: document.getElementById("destination").value,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			provideRouteAlternatives: true,
			avoidTolls: true
		}
		
	var d = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
		
	d.route(directionsReq, function (results) { //callback for results
		var mapOptions = {
			center: new google.maps.LatLng(38.895111, -77.036667), //sets center of map to DC area, since that's the scope of our app
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		console.log(results); //debugging
		
		var map = new google.maps.Map(document.getElementById("map_canvas1"), mapOptions); //writes the map to the DOM
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
		
		driveTime = results.routes[0].legs[0].duration.value; //sets the global variable to these results for calculating drive time
		console.log(driveTime); //debugging
		
		timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
	});
}

function loadTransitDirections() { //loads map and results for public transit route using the Google Directions API
	var directionsReq = {
			origin: "8191 Strawberry Lane, Falls Church, VA", //set to default for debugging
			destination: "National Gallery of Art, Washington, DC", //set to default for debugging
			//origin: document.getElementById("startAddress").value,
			//destination: document.getElementById("destination").value,
			travelMode: google.maps.TravelMode.TRANSIT,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			provideRouteAlternatives: true
		}
		
	var d = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
		
	d.route(directionsReq, function (results) { //callback
		var mapOptions = {
			center: new google.maps.LatLng(38.895111, -77.036667), //centers map to DC area to fit the scope of the app
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		console.log(results); //debugging
		
		var map = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);//writes the resulting map to the DOM
		
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
		
		transitTime = results.routes[0].legs[0].duration.value; //sets the global variable to the travel time for later calculations
		
		timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
		
		console.log(transitTime); //debugging
	});
}
	
function timeCalc() { //tells the user which route is faster
	var timeDifference; //the time difference between the two routes
	
	if (driveTime) { //displays the total route time for the driving route
		document.getElementById("timeDiv1").innerHTML = "Driving Route: " + Math.round(driveTime / 60) + " minutes";
	}
	
	if (transitTime) { //displays the total route time for the transit route
		document.getElementById("timeDiv2").innerHTML = "Transit Route: " + Math.round(transitTime / 60) + " minutes";
	}
	
	//calculates the time saved when using one route over the other. Tells which is shorter and by how long
	if(driveTime && transitTime) { //makes sure both variables have a value before attempting to calculate the values, so as to avoid a return of undefined
		if (driveTime < transitTime) {
			timeDifference = transitTime - driveTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			document.getElementById("resultsDiv").innerHTML = "Driving to this destination is faster by " + timeDifference + " minutes.";
		} else if (transitTime < driveTime) {
			timeDifference = driveTime - transitTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			document.getElementById("resultsDiv").innterHTML = "Taking public transit to this destination is faster by " + timeDiffence + " minutes";
		} else {
			document.getElementById("resultsDiv").innerHTML = "Both routes take the same amount of time."; //if both are equal, alerts the user
		}
	console.log(timeDifference); //debugging
	}	
}

function onSubmitClick() { //calls the map loading functions when the user clicks the submit button
    //alert("CONGRATULATIONS! YOU CLICKED A BUTTON");
    loadDriveDirections();
    loadTransitDirections();
    return false; //makes sure the form doesn't submit itself
}

function init() {
    document.getElementById("submitForm").onclick = onSubmitClick;
    document.getElementById("informationForm").onsubmit = onSubmitClick; //after filling out form, user can submit by pressing enter
}

window.onload = init;
