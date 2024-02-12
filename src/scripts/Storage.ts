// src/TokenStorage.ts

interface TokenData {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    code?: string;
    code_verifier?: string;
  }
  
  export class TokenStorage {
    private data: TokenData;
  
    constructor() {
      this.data = {
        access_token: undefined,
        refresh_token: undefined,
        expires_in: undefined,
        code: undefined,
        code_verifier: undefined,
      };
  
      this.loadFromStorage();
    }
  
    private loadFromStorage(): Promise<void> {
      return new Promise((resolve) => {
        chrome.storage.local.get("tokenData", (result) => {
          const storedTokenData = result.tokenData;
          if (storedTokenData) {
            this.data = storedTokenData;
          }
          resolve();
        });
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
    
    