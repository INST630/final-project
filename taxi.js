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


calcRate(taxiDistance,taxiInfo["DC"])+

function findTaxi (startAddress, destinationAddress) {  //finds one way trip cost, round trip cost
    var i;
    for(i=0;i<2; i++){
        if(startAddress.search(/dc/i)){
            
        }
        
        else if(startAddress.search(//i)){
            
        }
        
        else if(startAddress.search(/dc/i)){
            
        }
        
        else {
            
        }
    }
    
    
    //if destination is a different city than the start address, suggest only taxis that are in both cities
    //calculate cost 
    
    // if in dc, md, va, 
    
       //display total cost, avg cost
       // also display distance/ total travel time: from google API
       
}

function addressCity(startAdress, destinationAddress){
    if (startAddress )
    
}
var startAddress = document.getElementById("startAddress").value;
var startCity= startAddress.search(/dc/i);

var destinationAddress = document.getElementById("destination").value;



console.log(findTaxi(startAddress,destinationAddress));


function roundtripRate( ){
    // if destination is a different city than the start address, --> calc rate based on city a + calc rate based on city b
    
    
}

calcRate(taxiDistance,taxiInfo["DC"])+
calcRate(taxiDistance,taxiInfo["Dulles"]);

//input initial/final destinations/
//departure time of day/also day of week?

//suggest taxis in the area, output name and phone number


cabs[0].name;
    
   
  /*  

 */
    
    //input initial destination
    //input list of taxi locations
    //for the list of taxis, select the closest
}

/*
//total cost
function totalTaxiRateCalc (taxiDistance){
    var i;
    for(i=0; i<taxiDistance; i++){
        var totalTaxiRate = 3 + ((.27)*(.125*taxiDistance)); //First 1/8 mile: $3.00m Each additional 1/8 mile: $0.27
    } 
    return totalTaxiRate;
}

//console.log(totalTaxiRateCalc(4));

//avg rate/mile

function avgTaxiRate (taxiDistance){
    var i;
    for(i=0; i<taxiDistance; i++){
        var taxiRatePerMile = (3 + ((.27)*(.125*taxiDistance)))/taxiDistance; //First 1/8 mile: $3.00m Each additional 1/8 mile: $0.27
    } 
    
    return taxiRatePerMile;
}

console.log(avgTaxiRate(4));

*/

//taxiDistance: Google API?


//time