import {TrackInfo,PlayPostData,Device} from './interface'

export async function getCurrentlyPlaying(access_token:string): Promise<any>{
    const result = await fetch("https://api.spotify.com/v1/me/player?additional_types=track,episode", {
      method: "Get",
      headers:{
        Authorization: `Bearer ${access_token}`
      }
    });
    return await result.json();
  };

   export async function play(songInfo: TrackInfo, deviceId: Device, accessToken: string) {
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId.id}`;
    console.log("from play trackInfo",songInfo);
    const postData: PlayPostData = {
      position_ms: songInfo.progressMs, // the time that current plays
    };
  
    try {
      return await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      throw e;
    }
  }

export async function pause(deviceId: Device, accessToken: string) {
  const url = `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId.id}`;

  try {
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (e) {
    throw e;
  }
}

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

export async function isSaved( id:string, accessToken: string,) {
  const url = `https://api.spotify.com/v1/me/tracks/contains?ids=${id}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const data = await res.json();
    console.log("data",data);
    return data[0];
  } catch (e) {
    return;
  }
}

export async function saveTrack(songInfo: TrackInfo, accessToken: string) {
  const url = 'https://api.spotify.com/v1/me/tracks'

  const postData = {
    ids: [songInfo.id],
  };

  try {
    const response =  await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(postData),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response from save",response);
  } catch (e) {
    throw e;
  }
}

export async function unSaveTrack(songInfo: TrackInfo, accessToken: string) {
  const url = 'https://api.spotify.com/v1/me/tracks';

  const postData = {
    ids: [songInfo.id],
  };

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      body: JSON.stringify(postData),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("response from unSave",response);
  } catch (e) {
    throw e;
  }
}

