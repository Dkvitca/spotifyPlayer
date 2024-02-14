import { TrackInfo, Device, PlayPostData,UserInstance } from './interface';
import { getCurrentlyPlaying, next, previous, play, pause, } from './spotify';
import { parseDevice, parsePlayPostData, parseTrackInfo } from './parse';
import { refreshToken } from './authorization';
import { Storage } from './Storage';

export class App {
  private trackInfo: TrackInfo | null;
  private device: Device | null;
  private playPostData: PlayPostData | null;

  constructor() {
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
    try {
        const result = await getCurrentlyPlaying(access_token);
    
        if (result) {
          if (result.item && result.item !== this.trackInfo) {
            // Update if there is a new playback item
            this.trackInfo = parseTrackInfo(result);
            this.device = parseDevice(result);
            Storage.set("trackInfo", this.trackInfo);
            Storage.set("device", this.device);
          } else if (!result.item && this.trackInfo) {
            // Use the last known state if there is no playback item
            this.trackInfo.is_playing = false; // Assume it's paused
          }
        }
      } catch (e) {
        console.log("Error getting current playback:", e);
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

