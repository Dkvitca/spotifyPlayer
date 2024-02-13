import { TrackInfo, Device, PlayPostData,UserInstance } from './interface';
import { getCurrentlyPlaying } from './spotify';
import { parseDevice, parsePlayPostData, parseTrackInfo } from './parse';
import { refreshToken } from './authorization';
import { Storage } from './Storage';

export class App {

  private trackInfo: TrackInfo | null;
  private device: Device | null;
  private playPostData: PlayPostData | null;
  private access_token: string | null;

  constructor() {
    this.access_token = null
    this.trackInfo = null;
    this.device = null;
    this.playPostData = null;
  }

  public async render(): Promise<void> {
    const access_token = await Storage.get("access_token");
    if (!access_token || !this.isValidAccessToken(access_token)) { // test current access token before making requests.
        await this.refreshTokenAndRender()
        return;
    }
    try{
        await getCurrentlyPlaying(access_token).then(async(result)=>{
            if (result.item !== this.trackInfo) {
                this.trackInfo = parseTrackInfo(result)
                this.device = parseDevice(result)
                Storage.set("trackInfo",this.trackInfo)
                Storage.set("device",this.device)
            }
        });
    } catch (e) {
        console.log("error getting currentplayback:",e);
    }
    chrome.runtime.sendMessage({message: "updateUI",trackInfo:this.trackInfo})
  }
  
  private async isValidAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.status !== 401;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }

  private async refreshTokenAndRender(): Promise<void> {
    const refresh_token = await Storage.get("refresh_token");
    const newAccessToken = await refreshToken(refresh_token);
  
    if (newAccessToken) {
      await Storage.set("access_token",newAccessToken)
      await this.render(); // Render again with the new access token
    } else {
      console.error('Unable to refresh access token.');
      // Add additional error-handling or user notification here if needed
    }
  }
}

