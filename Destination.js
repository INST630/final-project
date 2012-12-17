var driveTime; //global variable for the driving time
var taxiTime;//global variable for the taxi driving time
var transitTime; //global variable for the transit time

var costGas;//avg of gas costs by geolocation

var startAddress;//global for start address
var destinationAddress;//global for end address
var cheapestOption; //global for cheapest option

function gasCallBack(gasFeedResults) {
	var numStations=0;
	var totalPrice=0.0;
	/*var keys = Object.keys(gasFeedResults.stations[0]);
	for(var i=0;i<keys.length;i++){
		alert(keys[i]);
	}*/
	for (var i=0; i< gasFeedResults.stations.length; i++){
	//alert(gasFeedResults.stations[i].reg_price);
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
		document.getElementById("drivingFuelCost").innerHTML=avgPrice.toFixed(2);
		document.getElementById("drivingTotalCost").innerHTML=(avgPrice*driveDistance/(1609.34*20)).toFixed(2);
		console.log(avgPrice);
	}

}

var driveDirectionDisplay;
var driveDistance;
var driveMap;
var driveResults;
function loadDriveDirections() { //loads map and results for driving route: from start point to parking to destination using the Google Directions API
    var directionsReq = {
        origin: startAddress,
        destination: destinationAddress, //change to reflect parking 
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        provideRouteAlternatives: true,
        avoidTolls: true
    };

    var d = new google.maps.DirectionsService();

    d.route(directionsReq, function (results) { //callback for results
	if(results.routes.length === 0){
		alert("Address could not be found");
	}else{
	displayTabs();
	driveResults =results;
        var mapOptions = {
            center: new google.maps.LatLng(38.895111, -77.036667), //sets center of map to DC area, since that's the scope of our app
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        console.log('r', results); //debugging
	if(!driveDirectionDisplay){
		driveDirectionDisplay = new google.maps.DirectionsRenderer();       
		driveMap = new google.maps.Map($("#map_canvas_driving")[0], mapOptions); //writes the map to the DOM
		driveDirectionDisplay.setPanel(document.getElementById("map_driving_directions"));
		driveDirectionDisplay.setMap(driveMap);
	}

        driveDirectionDisplay.setDirections(results);
        driveDistance=results.routes[0].legs[0].distance.value;
        document.getElementById("drivingTime").innerHTML = results.routes[0].legs[0].duration.text;
        document.getElementById("drivingDistance").innerHTML = results.routes[0].legs[0].distance.text;

	google.maps.event.trigger(driveMap,"resize");
        var geoOptions =   {
            address: startAddress,
            region: "us"
        };

        var g = new google.maps.Geocoder();
        g.geocode(geoOptions, function (geocodeResults) {
            var inputLat= geocodeResults[0].geometry.location.lat();
            var inputLng= geocodeResults[0].geometry.location.lng();
			
            $.ajax({
                url: "http://devapi.mygasfeed.com/stations/radius/" + inputLat + "/" + inputLng + "/5/reg/price/rfej9napna.json?callback=?",
                dataType: "jsonp",
                success: gasCallBack
            }); // end ajax

            //timeCalc(); //calls timeCalc function so it doesn't try to calculate before the results are back from the API
        });// end geocode 
	}
    }); // end route
    
}//close loadDriveDirections


var taxiDirectionDisplay;
var taxiMap;
var taxiResults;
function loadTaxiDirections() { //loads map and results for driving route: from start point to end point using the Google Directions API
    var directionsReq = {
        origin: startAddress,
        destination: destinationAddress, //change to reflect parking 
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        provideRouteAlternatives: true,
        avoidTolls: true
    };

    var d = new google.maps.DirectionsService();

    d.route(directionsReq, function (results) { //callback for results
	if(results.routes.length > 0){
	taxiResults=results;
        var mapOptions = {
            center: new google.maps.LatLng(38.895111, -77.036667), //sets center of map to DC area, since that's the scope of our app
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
	if(!taxiDirectionDisplay){
		taxiDirectionDisplay = new google.maps.DirectionsRenderer();
	        taxiMap = new google.maps.Map($("#map_canvas_taxi")[0], mapOptions); //writes the map to the DOM
	        taxiDirectionDisplay.setMap(taxiMap);		
	}
	
        console.log('t', results); //debugging
        taxiDirectionDisplay.setDirections(results);
	doTaxi(results);
        
	google.maps.event.trigger(taxiMap,"resize");
        console.log(driveTime); //debugging
	}
    });
} //close load Taxi Directions

var transitDirectionDisplay;
var transitMap;
var transitResults;
function loadTransitDirections() { //loads map and results for public transit route using the Google Directions API
	var directionsReq = {
		origin: startAddress,
		destination: destinationAddress,
		travelMode: google.maps.TravelMode.TRANSIT,
		unitSystem: google.maps.UnitSystem.IMPERIAL,
		provideRouteAlternatives: false,
		/*
		transitOptions: {
		    departureTime: buildUnixTime($('#departureTime').val())
		}
		*/
	}
	
	var d = new google.maps.DirectionsService();		
	d.route(directionsReq, function (results) { //callback
		if(results.routes.length>0){
		transitResults=results;
		if(!transitDirectionDisplay){
			var mapOptions = {
			    center: new google.maps.LatLng(38.895111, -77.036667), //centers map to DC area to fit the scope of the app
			    zoom: 17,
			    mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			transitMap = new google.maps.Map($("#map_canvas_transit")[0], mapOptions);//writes the resulting map to the DOM
			transitDirectionDisplay = new google.maps.DirectionsRenderer();
			transitDirectionDisplay.setPanel(document.getElementById("map_transit_directions"));
			transitDirectionDisplay.setMap(transitMap);
		}
		
		transitDirectionDisplay.setDirections(results);
		google.maps.event.trigger(transitMap,"resize");
		var transitCost = calculateTransitCost(results.routes);
		}
	});
} //close load transit directions

function resizeMaps(){
	if(driveMap){
		google.maps.event.trigger(driveMap,"resize");
		driveDirectionDisplay.setDirections(driveResults);

	}
	if(transitMap){
		google.maps.event.trigger(transitMap,"resize");
		transitDirectionDisplay.setDirections(transitResults);

	}
	if(taxiMap){
		google.maps.event.trigger(taxiMap,"resize");
		taxiDirectionDisplay.setDirections(taxiResults);

	}
}

function removeChildren(e)
{
	while(e.childNodes.length > 0){
		e.removeChild(e.childNodes[0]);
	}
}

function metroCost(from, to){
	console.log("From: "+from);
	console.log("To: "+to);
	var fs = null;
	for(var i =0;i<globalStations.length;i++){
		if(
		   globalStations[i].name ===
		   from.substring(0, globalStations[i].name.length)
		   )
		{
			fs = globalStations[i];
		}
	}
	if(fs != null){
		var ds = null;
		for(var j=0;j<fs.prices.length;j++){
			if(
				fs.prices[j].name ===
				to.substring(0,fs.prices[j].name.length)
			){
				ds = fs.prices[j];
			}
		}
		if(ds !=null){
			console.log("Peak price from "+from+" to "+to+": $"+ds.peak);
			return ds.peak;
		}else{
			console.log("Cannot find destination: "+to);
		}
	}else{
		console.log("Cannot find origin: "+from);
	}
	return 0;
}

function calculateTransitCost(results){
	var totalCost = 0;
	var busStops = 0;
	var metroStops = 0;
	var busCost = 0;
	for(var i=0; i<results[0].legs[0].steps.length;i++){
		if(results[0].legs[0].steps[i].transit){
			if(results[0].legs[0].steps[i].transit.line.vehicle.name==="Bus"){
				busStops+=results[0].legs[0].steps[i].transit.num_stops;
				busCost = 1.80;
			}else if(results[0].legs[0].steps[i].transit.line.vehicle.name==="Subway"){
				metroStops+=results[0].legs[0].steps[i].transit.num_stops;
				totalCost += metroCost(
					results[0].legs[0].steps[i].transit.departure_stop.name,
					results[0].legs[0].steps[i].transit.arrival_stop.name
				);
			}
			/* alert(results[0].legs[0].steps[i].transit.line.agencies[0].name);
			*/
		}
	}
	totalCost += busCost;
        transitTime = results[0].legs[0].duration.text; //sets the global variable to the travel time for later calculation
	document.getElementById("transitTime").innerHTML=transitTime;
	document.getElementById("numberStops").innerHTML=metroStops;
	document.getElementById("numberBusStops").innerHTML=busStops;
	document.getElementById("transitCostPerPerson").innerHTML=totalCost;
	var people = document.getElementById("numTravellers").value;
	document.getElementById("transitTotalCost").innerHTML=totalCost * people;
}	
	
function timeCalc() { //tells the user which route is faster
	var timeDifference; //the time difference between the three routes
	
	if (driveTime) { //displays the total route time for the driving route
		$("#timeDiv1").innerHTML = "Driving Route: " + Math.round(driveTime / 60) + " minutes"; //change route to reflect parking
		//don't grey drive
	} else {
		//grey drive time
	}
	
	if (taxiTime){ //displays the total route time for the taxi route
		$("#timeDiv1").innerHTML = "Driving Route: " + Math.round(taxiTime / 60) + " minutes";
		//don't grey taxi
	}else {
		//grey taxi
	}
	
	if (transitTime) { //displays the total route time for the transit route
		$("#timeDiv2").innerHTML = "Transit Route: " + Math.round(transitTime / 60) + " minutes";
		//don't grey transit
	}else {
		//grey transit
	}
	
	//calculates the time saved when choosing between 3 routes. Tells which is shorter and by how long.
	if(driveTime && transitTime && taxiTime ) { //makes sure both variables have a value before attempting to calculate the values, so as to avoid a return of undefined
		if (driveTime < transitTime && driveTime < taxiTime) {
			timeDifference = transitTime - driveTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			$("#resultsDiv").innerHTML = "Driving to this destination is faster by " + timeDifference + " minutes.";
		
		} else if (taxiTime < transitTime &&  taxtTime < driveTime) {
			timeDifference = transitTime - taxiTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			$("#resultsDiv").innerHTML = "Taking a taxi to this destination is faster by " + timeDifference + " minutes.";	
			
		} else if (transitTime < driveTime && driveTime < taxiTime) {
			timeDifference = driveTime - transitTime;
			timeDifference = Math.round(timeDifference / 60); //Google API measures time in seconds, so is converted to minutes and rounded to nearest integer
			$("#resultsDiv").innterHTML = "Taking public transit to this destination is faster by " + timeDiffence + " minutes";
		} else {
			$("#resultsDiv").innerHTML = "All routes take the same amount of time."; //if all are equal, alerts the user
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

var tabsDisplayed=false;
function displayTabs(){
	if(!tabsDisplayed){
		tabsDisplayed=true;
		$('#map_dummy').hide();
		document.getElementById("tabcontent").style.display="block";
		$('#drivingTab').tab('show');
	}
}


function onSubmitClick() { //calls the map loading functions when the user clicks the submit button
	startAddress = $.trim($("#startAddress").val());
	destinationAddress = $.trim($("#destination").val());
	if(startAddress.length===0){
		if(destinationAddress.length===0){
			alert("Please enter a starting and destination address");
		}else{
			alert("Please enter a starting address");
		}
	}else{
		if(destinationAddress.length===0){
			alert("Please enter a destination address");
		}else{
			drawMaps();
		}
	}
	
	//startAddress = "7 gentle court";
	//destinationAddress = "US Capitol Building";


    return false; //makes sure the form doesn't submit itself
}
/*
function buildUnixTime(userInputTime) {
    var now = new Date();
    var dd = now.getDate();
    var mm = now.getMonth()+1; //January is 0!
    var yyyy = now.getFullYear();
    var date = yyyy + '-' + mm + '-' + dd;
    var timeString = date + ' ' + userInputTime;
    
    var unixTime = Date.parse(timeString);
    console.log(unixTime);
    return new Date(unixTime);
}
*/

function drawMaps() {
	loadDriveDirections();
	loadTransitDirections();
	loadTaxiDirections();
}


function showmap(id){    
    var geoOptions =   {
        address: "Washington, DC",
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
	});
}

function init() {
    $("#submitForm").click(onSubmitClick);
    $("#informationForm").submit(onSubmitClick); //after filling out form, user can submit by pressing enter
//    $("#calcCost").click(calcCostClick);
    showmap("map_dummy"); // Show the user a "blank" map which we'll hide after the user clicks submit
    // got this from the bootstrap site to make the tabs work
    $('a[data-toggle="tab"]').click(function(event) {
        event.preventDefault();
	if(tabsDisplayed){
		$(this).tab('show');
		resizeMaps(); // The google map gets messed up when it's rendered as "display: none" so re-draw all the maps everytime a tab is clicked
	}
    });

}

window.onload = init;