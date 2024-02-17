export interface UserInstance {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    code?: string;
    code_verifier?: string;
    is_login?: boolean;
  }
  

export interface Device {
    id?: string;
    is_active?: boolean;
    is_restricted?: boolean;
    name?: string;
    type?: string;
    volume_percent?: string;
  }

  interface Artist {
    name?: string;
    url?: string;
  }
  interface Album {
    name: string;
    releaseDate: string;
    href: string;
  }

  export interface TrackInfo {
    title?: string;
    artist?: Artist;
    album?: Album;
    repeatState?: string;
    is_playing?: boolean;
    coverPhoto?: string;
    uri?: string;
    progressMs?: number;
    durationMs?: number;
    trackUrl?: string;
    id?: string;
    isSave?: boolean;
    context?: {
      type: 'artist' | 'playlist' | 'album' | 'show';
      href: string;
      externalUrls: {
        spotify: string;
      };
      uri: string;
    };
  }
  
  // From API
   export interface PlayPostData {
      uris?: string[];
      position_ms?: number;
      context_uri?: string;
      offset?: {
        uri: string;
      };
    }