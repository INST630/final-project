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
			
		console.log(results);
		var map = new google.maps.Map(document.getElementById("map_canvas1"), mapOptions);
		directionsDisplay.setMap(map);
			
		directionsDisplay.setDirections(results);
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
	});
}

function onSubmitClick() {
    alert("CONGRATULATIONS! YOU CLICKED A BUTTON");
    loadDriveDirections();
    loadTransitDirections();
}

function init() {
    document.getElementById("submitForm").onclick = onSubmitClick;
}

window.onload = init;
