;// Global variables
var photosArrayGlobal;  // the array of photos to be displayed
var photoIndexGlobal;   // the index into photosArrayGlobal of the current image beig displayed



// This function creates the file names for all photos specified by the user, using
// the current values for "folder", "base file name" and "number of photos".
// Stores these file names in the global array.
function onLoadPhotosButtonClick() {
    alert("onLoadPhotosButtonClick function says hello");
}

// This initialization function is only used to set up some of the click handling functionality
function init() {
    // When the user clicks the loadPhotosButton, the "loadPhotos" function will be called
    document.getElementById("loadPhotosButton").onclick = onLoadPhotosButtonClick;
    
    // Once you create functions to be called when other elements are clicked (e.g., the
    // previous button, next button, image), you should assign the function names to the
    // onclick properties of each element that will respond when the user clicks.
    // Follow the pattern used above for the loadPhotosButton.
}


/**
 * No need to edit below this line to meet the assignment requirements.
 */

// Set it up so the init function is called as soon as the document finishes loading
window.onload = init;