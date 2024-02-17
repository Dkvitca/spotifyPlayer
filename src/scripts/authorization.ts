
  // src/spotifyAuth.ts
  const clientId = encodeURI('8c6d2db1da4b4290903abb3d63dda6ce'); // your clientId
  const redirectUrl  = encodeURI('https://hlhhbpmimmkpkafnaghimoahbabfcknc.chromiumapp.org/');
  const authorizationEndpoint = "https://accounts.spotify.com/authorize";
  const tokenEndpoint = "https://accounts.spotify.com/api/token";
  const scope = 'user-library-modify user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read';
  

  export async function authorizeSpotify(): Promise<{ code_verifier: string, authUrl: string }> {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = randomValues.reduce((acc, x) => acc + possible[x % possible.length], "");
  
    const code_verifier = randomString;
    const data = new TextEncoder().encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
  
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    const authUrl = new URL(authorizationEndpoint)
    const params = {
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        code_challenge_method: 'S256',
        code_challenge: code_challenge_base64,
        redirect_uri: redirectUrl,
  };
  authUrl.search = new URLSearchParams(params).toString();
  return {code_verifier,authUrl:authUrl.toString()}
}
  
   export async function getToken(code: string,verifier:string): Promise<any> {
      const code_verifier = verifier;

      const requestBody: Record<string, string | null> = {
        client_id: clientId,
        grant_type: 'authorization_code',
        code:code, //from flow entry point
        redirect_uri: redirectUrl,
        code_verifier: code_verifier || null,  // explicitly handle null
      };

      const urlSearchParams = new URLSearchParams();
      
      Object.entries(requestBody).forEach(([key, value]) => {
        if (value !== null) {
          urlSearchParams.append(key, value);
        }
      });
    
      const response = await fetch(tokenEndpoint, { //request to get the access token
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams.toString(),
      });
    
      return await response.json();
    }
  

   export async function refreshToken(refresh_token:string): Promise<any> {
      const requestBody: { client_id: string; grant_type: string; refresh_token?: string } = {
        client_id: clientId,
        grant_type: 'refresh_token',
        refresh_token: refresh_token, 
      };
    
      const urlSearchParams = new URLSearchParams();
      Object.entries(requestBody).forEach(([key, value]) => {
        if (value !== undefined) {
          urlSearchParams.append(key, value);
        }
      });
    
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlSearchParams.toString(),
      });
    
      return await response.json();
    }
    
