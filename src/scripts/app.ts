import { TrackInfo, Device, PlayPostData } from './interface';
import { getCurrentlyPlaying } from './spotify';
import { parseDevice, parsePlayPostData, parseTrackInfo } from './parse';
import { refreshToken } from './authorization';
import { Storage } from './Storage';

export class App {
  private trackInfo: TrackInfo | null = {};
  private deviceId: Device | null = {};
  private playPause: PlayPostData | null = {};
  private readonly storage: Storage;

  constructor() {
    this.trackInfo = null;
    this.deviceId = null;
    this.playPause = null;
    this.storage = new Storage();
  }

  public async render(): Promise<void> {
    console.log("in render");
    const accessToken = this.storage.getAccessToken();

    if (!accessToken || !(await this.isValidAccessToken(accessToken))) {
      await this.refreshTokenAndRender();
      return;
    }
    
    const rawData = await getCurrentlyPlaying(accessToken);
    console.log("raw data",rawData);
    this.trackInfo = parseTrackInfo(rawData);
    this.deviceId = parseDevice(rawData);
    this.playPause = parsePlayPostData(rawData);
    chrome.runtime.sendMessage({message: "updateUI", trackInfo: this.trackInfo})
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
    const refresh_token = this.storage.getRefreshToken()!;
    const newAccessToken = await refreshToken(refresh_token);
  
    if (newAccessToken) {
      await this.storage.setAccessToken(newAccessToken);
      await this.render(); // Render again with the new access token
    } else {
      console.error('Unable to refresh access token.');
      // Add additional error-handling or user notification here if needed
    }
  }
}


  