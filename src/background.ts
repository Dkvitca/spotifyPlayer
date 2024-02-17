import { authorizeSpotify, getToken } from './scripts/authorization';
import {App} from './scripts/app.js'
import  {Storage} from './scripts/Storage'

const app = new App();

chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    switch (req.message) {
      case "render app":
        app.render();
        break;
      case "next":
        await app.nextTrack();
        break;
      case "previous":
        await app.prevTrack();
        break;
      case "play":
        await app.playTrack();
        break;
      case "pause":
        await app.pauseTrack();
      case "save":
        await app.save();
      default:
        // Handle other messages if needed
        break;
    }
  });


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'authorizeSpotify') {
    //chrome.storage.local.clear();

    const { code_verifier, authUrl } = await authorizeSpotify();

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
      },
      async (redirect_url) => {
        if (chrome.runtime.lastError) {
          console.error('Authorization error:', chrome.runtime.lastError);
          return;
        }

        const state = redirect_url?.substring(redirect_url.indexOf('state=') + 6);
        const code = redirect_url?.substring(redirect_url.indexOf('code=') + 5);

        if (code) {
          const tokenResponse = await getToken(code, code_verifier);
            Storage.set("access_token",tokenResponse.access_token);
            Storage.set("refresh_token",tokenResponse.refresh_token);
            Storage.set("expires_in",tokenResponse.expires_in);
            Storage.set("code",code);
            Storage.set("code_verifier",code_verifier);
            Storage.set("is_login",true);
        } else {
          console.error('No code received in the redirect URL.');
        }
      }
    );
  }

  chrome.action.setPopup({ popup: './dist/popup/player.html' }); //sets the player
});
