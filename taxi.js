var taxiDistance; //from google api?
var cabs;

//taxi fare calculator

function calcRate(distance, taxiInfoItem){
    var total=taxiInfoItem.initialCharge;
    var additionalDistance= distance - taxiInfoItem.fractionSize;
    var avgRate = total/distance;
    
    if (additionalDistance>0){
        var fractions= Math.ceil(additionalDistance/taxiInfoItem.fractionSize); //number of fractions
        total += fractions*taxiInfoItem.fractionCharge;
    }
    return total;
    return avgRate;
}
function doTaxi(results){ //calculate and display taxi data
    var geoOptions =   {
        address: startAddress,
        region: "us"
    };

    var g = new google.maps.Geocoder();
    g.geocode(geoOptions, function (geocodeResults) {
        var county=getCounty(geocodeResults);
      //  document.getElementById("county1").innerHTML=county;
        document.getElementById("county2").innerHTML=county;
    
        var taxi = taxiInfo[county];
        if(taxi===null){
            document.getElementById("taxiAvailable").style.display="none";
            document.getElementById("taxiUnavailable").style.display="block";
        }else{
            document.getElementById("taxiAvailable").style.display="block";
            document.getElementById("taxiUnavailable").style.display="none";
            document.getElementById("taxiTime").innerHTML=results.routes[0].legs[0].duration.text;
            document.getElementById("taxiDistance").innerHTML=results.routes[0].legs[0].distance.text;
            var div = Math.round(1.0/taxi.fractionSize);
            document.getElementById("taxiDivisor1").innerHTML=div;
            document.getElementById("taxiDivisor2").innerHTML=div;
            document.getElementById("taxiInitial").innerHTML=taxi.initialCharge.toFixed(2);
            document.getElementById("taxiAdditional").innerHTML=taxi.fractionCharge.toFixed(2);
            //1609.34 meters per mile
            var cost = calcRate(results.routes[0].legs[0].distance.value / 1609.34,taxi);
            document.getElementById("taxiCost").innerHTML=cost.toFixed(2);
            var taxilist=document.getElementById("taxiList");
            var cn = taxilist.childNodes;
            for(var i =0;i<cn.length;i++){
                taxilist.removeChild(cn[i]);
            }
            for(var i =0;i<taxi.cabs.length;i++){
                var e = document.createElement("li");
                var e1=document.createElement("div");
                var e2=document.createElement("div");
                e1.className="taxiName";
                e2.className="taxiPhone";
                e1.innerHTML=taxi.cabs[i].name;
                e2.innerHTML=taxi.cabs[i].phone;
                taxilist.appendChild(e);
                e.appendChild(e1);
                e.appendChild(e2);
                
            }
        
        }
    });
}


function getCounty(geocodeResults){
	var county = null;
	var city = null;
	for(var i=0; i<geocodeResults[0].address_components.length; i++){
		
		for (var j=0; j<geocodeResults[0].address_components [i].types.length; j++ ){
			
			if(geocodeResults[0].address_components[i].types[j] === "administrative_area_level_2"){
				county = geocodeResults[0].address_components[i].short_name;
			}
			
			if(geocodeResults[0].address_components[i].types[j] === "locality"){
				city = geocodeResults[0].address_components[i].short_name;
			}
		}	
	}
	
	if (county==null){
		county=city;
	}
	return county;
} //close getCounty


function taxiDisplay(startCounty){
    var rateInitial;
    var rateFraction;
    var rateTotal;
    var time;
    
    
}

/*function findTaxi (startCounty, destinationCounty) {  //finds one way trip cost, round trip cost
    for(var i=0;i<2; i++){
        
        var taxi=taxiInfo[startCounty];
        
        if(startCounty === "District of Columbia"){
            for(var j=0; j<taxiInfo["DC"].cabs[j].length;j++){
                console.log(taxiInfo["DC"].cabs[0].name);
                console.log(taxiInfo["DC"].cabs[0].phone); 
            }
            
        }
    
        else {
            alert("Cab information is unavailable for your start location");
        }

    }
}
*/

//console.log(findTaxi("District of Columbia", "District of Columbia"));

//calcRate(taxiDistance,taxiInfo["DC"])+
//calcRate(taxiDistance,taxiInfo["Dulles"]);
    
    //if destination is a different city than the start address, suggest only taxis that are in both cities
    //calculate cost 
    
    // if in dc, md, va, 
    
       //display total cost, avg cost
       // also display distance/ total travel time: from google API
       



function roundtripRate( ){
    // if destination is a different city than the start address, --> calc rate based on city a + calc rate based on city b
    
    
}



//input initial/final destinations/
//departure time of day/also day of week?

//suggest taxis in the area, output name and phone number

    //input initial destination
    //input list of taxi locations
    //for the list of taxis, select the closest

//taxiDistance: Google API?

//time