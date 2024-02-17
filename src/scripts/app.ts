import { TrackInfo, Device, PlayPostData,UserInstance } from './interface';
import { getCurrentlyPlaying, next, previous, play, pause,saveTrack } from './spotify';
import { parseDevice, parsePlayPostData, parseShow, parseTrackInfo } from './parse';
import { refreshToken } from './authorization';
import { Storage } from './Storage';

export class App {
  private trackInfo: TrackInfo | null;
  private device: Device | null;

  constructor() {
    this.trackInfo = null;
    this.device = null;
  }

  public async render(): Promise<void> {
    const access_token = await Storage.get("access_token");
    if (!access_token || !this.isValidAccessToken(access_token)) { // test current access token before making requests.
        await this.refreshTokenAndRender()
        return;
    }

    const result = await getCurrentlyPlaying(access_token);
    if (result.item && (result.item !== this.trackInfo)) {
      if (result.currently_playing_type=== 'episode'){
        this.trackInfo=parseShow(result);
        this.device=parseDevice(result);
        Storage.set("trackInfo", this.trackInfo);
        Storage.set("device", this.device);
      }
      else{
        this.trackInfo = parseTrackInfo(result);
        this.device = parseDevice(result);
        Storage.set("trackInfo", this.trackInfo);
        Storage.set("device", this.device);
      }
    } 
    chrome.runtime.sendMessage({message: "updateUI",trackInfo:this.trackInfo})
  }

  public async playTrack(): Promise<void> {
    const access_token = await Storage.get("access_token");
    if (this.trackInfo && this.device) {
        await play(this.trackInfo,this.device,access_token)
        
        setTimeout(async () => {//render on delay
            await this.render();
          }, 200);
    }
    else{console.log("error playing");}
  }

  public async pauseTrack(): Promise<void> {
    const access_token = await Storage.get("access_token");
    if (this.trackInfo && this.device) {
        await pause(this.device,access_token)
            
        setTimeout(async () => {//render on delay
            await this.render();
          }, 200);
    }
    else{console.log("error playing");}
  }

  public async nextTrack(): Promise<void> {
    const access_token = await Storage.get("access_token");
    await next(access_token);

    setTimeout(async () => {//render on delay
        await this.render();
      }, 200);
  }
  
  public async prevTrack(): Promise<void> {
    const access_token = await Storage.get("access_token");
    await previous(access_token);
    
    setTimeout(async () => {//render on delay
        await this.render();
      }, 200);
  }

  public async save(): Promise<void> {
    const access_token = await Storage.get("access_token");
    
    await saveTrack(this.trackInfo!,access_token);
    
    setTimeout(async () => {//render on delay
        await this.render();
      }, 200);
  }

  private async isValidAccessToken(accessToken: string): Promise<boolean> {
    console.log("isvalidaccessToken");
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.status !== 200;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return true;
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

