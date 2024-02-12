chrome.runtime.sendMessage({message: "init app"});

function updateTrackInfo(trackInfo: any) {
    document.getElementById("trackName")!.innerText = trackInfo.title;
    document.getElementById("artistName")!.innerText = trackInfo.artist.name;
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
    console.log("trackInfo from player",req.trackInfo);
    updateTrackInfo(req.trackInfo);
    setTimer(req.trackInfo.durationMs,req.trackInfo.progressMs)
  });
  
  function setTimer(durationMs: number, progressMs: number) {
    const timer = setTimeout(async() => {
      clearTimeout(timer);
      chrome.runtime.sendMessage({message: "render app"});
    }, durationMs - progressMs);
  }

  