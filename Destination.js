var driveTime; //global variable for the driving time
var taxiTime;//global variable for the taxi driving time
var transitTime; //global variable for the transit time

var costGas;//avg of gas costs by geolocation

var startAddress;

function gasCallBack(gasFeedResults) {
					var numStations=0;
					var totalPrice=0.0;
					/*var keys = Object.keys(gasFeedResults.stations[0]);
					for(var i=0;i<keys.length;i++){
						alert(keys[i]);
					}*/
					for (var i=0; i< gasFeedResults.stations.length; i++){
//						alert(gasFeedResults.stations[i].reg_price);
						var price = parseFloat(gasFeedResults.stations[i].price);
						if ( ! isNaN(price)) {
							totalPrice+= price;
							numStations++;
						}
					}
					
					if (numStations===0){
						alert ("The avg price in your region could not be found");
					} else {
						var avgPrice= totalPrice/numStations;
						alert(avgPrice);
					}

}

function loadDriveDirections() { //loads map and results for driving route: from start point to parking to destination using the Google Directions API
	var directionsReq = {
			//origin: "8191 Strawberry Lane, Falls Church, VA", //set to default for debugging
			//destination: "National Gallery of Art, Washington, DC", //set to default for debugging
			origin: startAddress,
			destination: document.getElementById("destination").value, //change to reflect parking 
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			provideRouteAlternatives: true,
			avoidTolls: true
	};

	var d = new google.maps.DirectionsService();
	var directionsDisplay = new google.maps.DirectionsRenderer();
		
	d.route(directionsReq, function (results) { //callback for results
		var mapOptions = {
			center: new google.maps.LatLng(38.895111, -77.036667), //sets center of map to DC area, since that's the scope of our app
			zoom: 17,
			mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
		console.log(results); //debugging
		
		var map = new google.maps.Map(document.getElementById("map_canvas_car"), mapOptions); //writes the map to the DOM
		directionsDisplay.setMap(map);
				
		directionsDisplay.setDirections(results);
			
		driveTime = results.routes[0].legs[0].duration.value; //sets the global variable to these results for calculating drive time
		
		document.getElementById("carTime").innerHTML = results.routes[0].legs[0].duration.text;
		document.getElementById("carDistance").innerHTML = results.routes[0].legs[0].distance.text;
		console.log(driveTime); //debugging
			
		var geoOptions =   {
			address: startAddress,
			region: "us"
		};
			
		var g = new google.maps.Geocoder();
		g.geocode(geoOptions, function (geocodeResults) {
			
			var inputLat= geocodeResults[0].geometry.location.lat();
			var inputLng= geocodeResults[0].geometry.location.lng();
			

			$.ajax({
				url: "http://devapi.mygasfeed.com/stations/radius/"+inputLat + "/" + inputLng + "/5/reg/price/rfej9napna.json?callback=?",
				dataType: "jsonp",
				success: function(x){
					gasCallBack(x);
				}
			}); // end ajax
			
			
			//timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
			
		});// end geocode 
	
	}); // end route

}//close loadDriveDirections



function loadTaxiDirections() { //loads map and results for driving route: from start point to end point using the Google Directions API
	var directionsReq = {
			//origin: "8191 Strawberry Lane, Falls Church, VA", //set to default for debugging
			//destination: "National Gallery of Art, Washington, DC", //set to default for debugging
			origin: startAddress,
			destination: document.getElementById("destination").value,
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
		
		var map = new google.maps.Map(document.getElementById("map_canvas_taxi"), mapOptions); //writes the map to the DOM
		var carDirectionsDiv = document.getElementById("carDirections");
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(carDirectionsDiv);
		directionsDisplay.setDirections(results);
		
		driveTime = results.routes[0].legs[0].duration.value; //sets the global variable to these results for calculating drive time
		console.log(driveTime); //debugging
		
	//	timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
	});
} //close load Taxi Directions


function loadTransitDirections() { //loads map and results for public transit route using the Google Directions API
	var directionsReq = {
			//origin: "8191 Strawberry Lane, Falls Church, VA", //set to default for debugging
			//destination: "National Gallery of Art, Washington, DC", //set to default for debugging
			origin: startAddress,
			destination: document.getElementById("destination").value,
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
		
		var map = new google.maps.Map(document.getElementById("map_canvas_transit"), mapOptions);//writes the resulting map to the DOM
		
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
		
		transitTime = results.routes[0].legs[0].duration.value; //sets the global variable to the travel time for later calculations


		
//		timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
		
		console.log(transitTime); //debugging
	});
} //close load transit directions
	
function timeCalc() { //tells the user which route is faster
	var timeDifference; //the time difference between the three routes
	
	if (driveTime ) { //displays the total route time for the driving route
		document.getElementById("timeDiv1").innerHTML = "Driving Route: " + Math.round(driveTime / 60) + " minutes"; //change route to reflect parking
		//don't grey drive
	} else {
		//grey drive time
	}
	
	if (taxiTime){ //displays the total route time for the taxi route
		document.getElementById("timeDiv1").innerHTML = "Driving Route: " + Math.round(driveTime / 60) + " minutes";
		//don't grey taxi
	}else {
		//grey taxi
	}
	
	if (transitTime) { //displays the total route time for the transit route
		document.getElementById("timeDiv2").innerHTML = "Transit Route: " + Math.round(transitTime / 60) + " minutes";
		//don't grey transit
	}else {
		//grey transit
	}
	
	//calculates the time saved when choosing between 3 routes. Tells which is shorter and by how long.
	if(driveTime && transitTime && taxiTime ) { //makes sure both variables have a value before attempting to calculate the values, so as to avoid a return of undefined
		if (driveTime < transitTime && driveTime< taxiTime) {
			timeDifference = transitTime - driveTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			document.getElementById("resultsDiv").innerHTML = "Driving to this destination is faster by " + timeDifference + " minutes.";
		
		} else if (taxiTime < transitTime &&  driveTime < driveTime) {
			timeDifference = transitTime - taxiTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			document.getElementById("resultsDiv").innerHTML = "Taking a taxi to this destination is faster by " + timeDifference + " minutes.";	
			
		} else if (transitTime < driveTime && driveTime < taxiTime) {
			timeDifference = driveTime - transitTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			document.getElementById("resultsDiv").innterHTML = "Taking public transit to this destination is faster by " + timeDiffence + " minutes";
		} else {
			document.getElementById("resultsDiv").innerHTML = "All routes take the same amount of time."; //if all are equal, alerts the user
		}
		
	} else if (driveTime && transitTime ){
		//calc time diff between driving/transit	
	
	} else if (driveTime && taxiTime){
		// calc time diff between driving/taxi
	
	} else if (transitTime && taxiTime) {
		//calc time diff between taxi and transit
	}
	console.log(timeDifference); //debugging
	
} //close TimeCalc

function onSubmitClick() { //calls the map loading functions when the user clicks the submit button
    //alert("CONGRATULATIONS! YOU CLICKED A BUTTON");
    
	startAddress = document.getElementById("startAddress").value;
	loadDriveDirections();
	loadTransitDirections();
	loadTaxiDirections();

    return false; //makes sure the form doesn't submit itself
}

function onCarClick(){
	document.getElementById("carContent").style.display="block"; 
	document.getElementById("transitContent").style.display="none";
	document.getElementById("taxiContent").style.display="none";
}

function onTaxiClick(){
	document.getElementById("carContent").style.display="none";
	document.getElementById("transitContent").style.display="none";
	document.getElementById("taxiContent").style.display="block";
}

function onTransitClick(){
	document.getElementById("carContent").style.display="none";
	document.getElementById("transitContent").style.display="block";
	document.getElementById("taxiContent").style.display="none";
}

function calcCostClick(){
	var input = document.getElementById("calcCost").checked;
	if(input){
	document.getElementById("hiddenCostCalculator").style.display="block";
	}else{
		
	document.getElementById("hiddenCostCalculator").style.display="none";
	}
}

function showmap(id){    
	var geoOptions =   {
			    address: "1633 Hydenwood Cres. Chesapeake",
			    region: "us"
			};
		
	var g = new google.maps.Geocoder();
	g.geocode(geoOptions, function (results) {
	
		var mapOptions = {
		center: new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()),
		 zoom: 17,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
			
		var map = new google.maps.Map(document.getElementById(id), mapOptions);
			
		console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());
	});
	
}

function init() {
    document.getElementById("submitForm").onclick = onSubmitClick;
    document.getElementById("informationForm").onsubmit = onSubmitClick; //after filling out form, user can submit by pressing enter
    document.getElementById("driveLink").onclick=onCarClick;
    document.getElementById("taxiLink").onclick=onTaxiClick;
    document.getElementById("transitLink").onclick=onTransitClick;
    document.getElementById("calcCost").onclick=calcCostClick;
    showmap("map_canvas_car");
    showmap("map_canvas_taxi");
    showmap("map_canvas_transit");
    
    
    
}

window.onload = init;
