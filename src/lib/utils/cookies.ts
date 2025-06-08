export function setCookie(name: string, value: string, options: { [key: string]: any } = {}) {
    let cookieString = `${name}=${value};`;
    for (const propName in options) {
        cookieString += `${propName}=${options[propName]};`;
    }
    document.cookie = cookieString;
}

export function deleteCookie(name: string, path: string = '/', domain: string | null = null) {
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''}`;
          return;
        }
      }
    }
  }

export function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}