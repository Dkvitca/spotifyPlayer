import { authorizeSpotify, getToken } from './scripts/authorization';
import {App} from './scripts/app.js'

const app = new App();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.message === 'init app'){
        app.render();    
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'authorizeSpotify') {
    chrome.storage.local.clear();

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

          const tokenData = {
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expires_in: tokenResponse.expires_in,
            code: code,
            code_verifier: code_verifier,
          };

          chrome.storage.local.set({ tokenData: tokenData }, () => {
            console.log('Token data saved to storage:', tokenData);
          });
        } else {
          console.error('No code received in the redirect URL.');
        }
      }
    );
  }

  sendResponse({ redirectToPlayer: true });
  chrome.action.setPopup({ popup: './dist/popup/player.html' });
});
