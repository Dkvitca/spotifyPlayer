

export async function getCurrentlyPlaying(access_token:string): Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/player", {
      method: "Get",
      headers:{
        Authorization: `Bearer ${access_token}`
      }
    });
    return await result.json();
  };

  //  async function play(songInfo: TrackInfo, deviceId: string, accessToken: string) {
  //   const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
  
  //   const postData: PlayPostData = {
  //     position_ms: songInfo.progressMs, // the time that current plays
  //   };
  
  //   try {
  //     return await fetch(url, {
  //       method: 'PUT',
  //       body: JSON.stringify(postData),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //   } catch (e) {
  //     throw e;
  //   }
  // }

 export async function next (access_token: string): Promise<void> {
    try{
        await fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers:{
              Authorization: `Bearer ${access_token}`
            }
          });
    } catch (e) {
        throw e;
    }
}

 export async function previous (access_token: string): Promise<void> {
    try{
        await fetch("https://api.spotify.com/v1/me/player/previous", {
            method: "POST",
            headers:{
              Authorization: `Bearer ${access_token}`
            }
          });
    } catch (e) {
        throw e;
    }
}