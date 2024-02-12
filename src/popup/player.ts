
function updateTrackInfo(trackInfo: any) {
    document.getElementById("trackName")!.innerText = trackInfo.trackName;
    document.getElementById("artistName")!.innerText = trackInfo.artistName;
  }
  
  // Event listeners for buttons
  document.getElementById("skipBackward")!.addEventListener("click", () => {
    // Add logic to skip backward
    console.log("Skip Backward clicked");
  });
  
  document.getElementById("playPause")!.addEventListener("click", () => {
    // Add logic to play/pause
    console.log("Play/Pause clicked");
  });
  
  document.getElementById("skipForward")!.addEventListener("click", () => {
    // Add logic to skip forward
    console.log("Skip Forward clicked");
  });
  
  // Example usage of the updateTrackInfo function
  chrome.runtime.onMessage.addListener(async (req)=>{
    if (req.message === 'updateUI')
    updateTrackInfo(req.trackInfo);
  });
  
  