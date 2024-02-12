import {authorizeSpotify,getToken} from './scripts/authorization'
import {TokenStorage} from './scripts/Storage'

const tokenData = new TokenStorage();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.message === "authorizeSpotify") {
 
      chrome.storage.local.clear();
      const { code_verifier, authUrl } = await authorizeSpotify();
      tokenData.setCodeVerifier(code_verifier);
  

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
  
          // Check if 'code' is defined before proceeding
          if (code) {
            tokenData.setCode(code);
  
            // Call getToken with code_verifier and code
            const tokenResponse = await getToken(code, code_verifier);
 
            tokenData.setAccessToken(tokenResponse.access_token);
            tokenData.setRefreshToken(tokenResponse.refresh_token);
            tokenData.setExpiresIn(tokenResponse.expires_in);
          } else {
            console.error('No code received in the redirect URL.');
          }
        }
      );
    }
    
    sendResponse({redirectToPlayer:true});
    chrome.action.setPopup({popup: "./dist/popup/player.html"})
    
  });