import {TrackInfo,Device,PlayPostData} from './interface'


 export function parseTrackInfo(rawDataString: any): TrackInfo {
    const rawData = rawDataString
    const trackInfo: TrackInfo = {
      title: rawData.item.name,
      artist: {
        name: rawData.item.artists[0].name,
        url: rawData.item.artists[0].external_urls.spotify,
      },
      album: {
        name: rawData.item.album.name,
        releaseDate: rawData.item.album.release_date,
        href: rawData.item.album.href,
      },
      repeatState: rawData.repeat_state,
      is_playing: rawData.is_playing,
      coverPhoto: rawData.item.album.images[0].url,
      uri: rawData.item.uri,
      progressMs: rawData.progress_ms,
      durationMs: rawData.item.duration_ms,
      trackUrl: rawData.item.external_urls.spotify,
      id: rawData.item.id,
      isSave: false,
    };

    let context;
    if (rawData.context) {
      const { type, href, external_urls, uri } = rawData.context;
      context = {
        type,
        href,
        uri,
        externalUrls: external_urls,
      };
    }

    const object = Object.assign(trackInfo, { context });
    return object;
  }

  export function parseDevice(rawDataString: any): Device {
    const rawData = rawDataString;
  
    const device: Device = {
      id: rawData.device.id,
      is_active: rawData.device.is_active,
      is_restricted: rawData.device.is_restricted,
      name: rawData.device.name,
      type: rawData.device.type,
      volume_percent: rawData.device.volume_percent,
    };
  
    return device;
  }

  export function parsePlayPostData(rawDataString: any): PlayPostData {
    const rawData = rawDataString
  
    const playPostData: PlayPostData = {
      uris: [], // Set based on your logic
      position_ms: rawData.progress_ms,
      context_uri: rawData.context.uri,
      offset: {
        uri: rawData.item.uri,
      },
    };
  
    return playPostData;
  }

  export function parseShow(rawData: any): TrackInfo {
    const trackInfo: TrackInfo = {
      title: rawData.item.name,
      artist: {
        name: rawData.item.show.name,
        url: rawData.item.show.external_urls.spotify,
      },
      repeatState: rawData.repeat_state,
      is_playing: rawData.is_playing,
      coverPhoto: rawData.item.images[0].url,
      uri: rawData.item.uri,
      progressMs: rawData.progress_ms,
      durationMs: rawData.item.duration_ms,
      trackUrl: rawData.item.external_urls.spotify,
      id: rawData.item.id,
      isSave: false,
    };

    let context;
    if (rawData.context) {
      const { type, href, external_urls, uri } = rawData.context;
      context = {
        type,
        href,
        uri,
        externalUrls: external_urls,
      };
    }

    const object = Object.assign(trackInfo, { context });
    return object;
  }