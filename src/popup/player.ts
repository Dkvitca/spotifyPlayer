  chrome.runtime.sendMessage({message: "render app"})


function updateTrackInfo(trackInfo: any) {
  const playButton = document.getElementById("playButton");
  const pauseButton = document.getElementById("pauseButton");
  const backgroundImage = document.getElementById("backgroundImage");
  const likeButton = document.getElementById("addToMySongs");
  const unLikeButton = document.getElementById("removeMySongs");
  const shuffleButton = document.getElementById("shuffle");
  const sound = document.getElementById("sound");

  if (trackInfo.isSave) {// is a saved button? display the opposite
    likeButton!.style.display = 'inline-block';
    unLikeButton!.style.display = 'none';
  }
  else{
    likeButton!.style.display = 'none';
    unLikeButton!.style.display = 'inline-block';
  }

  if(trackInfo.is_playing){// Show the play/pause button
    playButton!.style.display = 'none';
    pauseButton!.style.display = 'inline-block'; 
  }
  else{
    playButton!.style.display = 'inline-block'; 
    pauseButton!.style.display = 'none';
  }
  
  if (trackInfo.context.type === 'show'){
    document.getElementById("album")!.style.display = 'none'
    document.getElementById("year")!.style.display = 'none'
  }
  else{
    document.getElementById("album")!.innerText = trackInfo.album.name;
    document.getElementById("year")!.innerText = trackInfo.album.releaseDate;
  }

    document.getElementById("trackName")!.innerText = trackInfo.title;
    document.getElementById("artistName")!.innerText = trackInfo.artist.name;
    backgroundImage!.style.backgroundImage = `url('${trackInfo.coverPhoto}')`
    backgroundImage!.style.backgroundSize = 'cover';
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
  
  document.getElementById("removeMySongs")!.addEventListener("click", () =>{

    console.log("addToMySongs clicked");
    chrome.runtime.sendMessage({message: "save"});
  });

  document.getElementById("addToMySongs")!.addEventListener("click", () =>{

    console.log("remove from my songs clicked");
    chrome.runtime.sendMessage({message: "unSave"});
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
      console.log("duration-progress",durationMs-progressMs);
    }, durationMs - progressMs);
  }

  