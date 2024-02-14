
  chrome.runtime.sendMessage({message: "render app"})
  console.log("from popup sendMessage: render app PRESSED!");

function updateTrackInfo(trackInfo: any) {
    document.getElementById("trackName")!.innerText = trackInfo.title;
    document.getElementById("artistName")!.innerText = trackInfo.artist.name;
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");

    if(trackInfo.is_playing){
      playButton!.style.display = 'none';
      pauseButton!.style.display = 'inline-block'; 
    }
    else{
      playButton!.style.display = 'inline-block'; // Show the play button
      pauseButton!.style.display = 'none';
    }
  }
 
  // Event listeners for buttons
  document.getElementById("skipBackward")!.addEventListener("click", () => {
    // Add logic to skip backward
    console.log("Skip Backward clicked");
    chrome.runtime.sendMessage({message: "previous"})
  });

  document.getElementById("skipForward")!.addEventListener("click", () => {
    // Add logic to skip forward
    console.log("Skip Forward clicked");
    chrome.runtime.sendMessage({message: "next"})
  });

  document.getElementById("pauseButton")!.addEventListener("click", () => {
    // Add logic to play/pause
    console.log("Pause clicked");
    chrome.runtime.sendMessage({message: "pause"})
  });

  document.getElementById("playButton")!.addEventListener("click", () => {
    // Add logic to play/pause
    console.log("Play clicked");
    chrome.runtime.sendMessage({message: "play"})
  });
  

  
  chrome.runtime.onMessage.addListener(async (req)=>{
    if (req.message === 'updateUI'){
      updateTrackInfo(req.trackInfo);
      setTimer(req.trackInfo.durationMs,req.trackInfo.progressMs)
    }
  });
  
  function setTimer(durationMs: number, progressMs: number) {//handle track ends
    const timer = setTimeout(async() => {
      console.log("from timer calling to render app")
      clearTimeout(timer);
      chrome.runtime.sendMessage({message: "render app"});
    }, durationMs - progressMs);
  }

  