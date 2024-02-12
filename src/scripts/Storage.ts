import { TokenData } from "./interface";
export class Storage {
    private data: TokenData = {};
  
    constructor() {
      // Initialize the token data from storage on construction
      this.loadFromStorage();
    }
  
    private loadFromStorage(): void {
      chrome.storage.local.get("tokenData").then((result) => {
        this.data.access_token = result.tokenData.access_token;
        this.data.refresh_token = result.tokenData.refresh_token
        this.data.expires_in = result.tokenData.expires_in
        this.data.code = result.tokenData.code
        this.data.code_verifier = result.tokenData.code_verifier
      });
    }
  
    getAccessToken(): string | undefined {
      return this.data.access_token;
    }
  
    setAccessToken(token: string): void {
      this.data.access_token = token;
      this.updateStorage();
    }
  
    getRefreshToken(): string | undefined {
      return this.data.refresh_token;
    }
  
    setRefreshToken(token: string): void {
      this.data.refresh_token = token;
      this.updateStorage();
    }
  
    getExpiresIn(): number | undefined {
      return this.data.expires_in;
    }
  
    setExpiresIn(expiresIn: number): void {
      this.data.expires_in = expiresIn;
      this.updateStorage();
    }
    setCode(code:string): void {
        this.data.code = code;
        this.updateStorage();
    }
    getCode(): string | undefined {
        return this.data.code;
    }
    setCodeVerifier(code_verifier:string): void {
        this.data.code_verifier = code_verifier;
        this.updateStorage();
    };
    getCodeVerifier(): string | undefined {
        return this.data.code_verifier
    }
    
    private updateStorage(): void {
      // Update the storage with the latest token data
      chrome.storage.local.set({ tokenData: this.data });
    }
  }