export class Storage {
  static async get(key: string): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result[key]);
      });
    });
  }

  static set(key: any, value: any): void {
    chrome.storage.local.set({ [key]: value });
  }
}
