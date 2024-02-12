

document.getElementById("loginButton")?.addEventListener("click", () => {
    // Send a message to the background script to initiate Spotify authorization
    chrome.runtime.sendMessage({ message: "authorizeSpotify" });
    window.close();
  });
  

