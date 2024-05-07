export class URLUtils {
  static isValidURL(url: string) {
    try {
      const newUrl = new URL(url);
      if (newUrl.protocol !== 'http:' && newUrl.protocol !== 'https:') {
        return false;
      }
      if (newUrl.host === 'localhost' || newUrl.host === '127.0.0.1') {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  static getDomain (url: string){
    const newUrl = new URL(url);
    return newUrl.hostname;
  }
}
