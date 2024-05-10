export const getSubdomain = (request: Request) => {
  let host = null;
  
  if (request.url.startsWith('http')) {
    const url = new URL(request.url);
    host = url.hostname;
  } else {
    host = request.headers.get('host');
  }

  if (host) {
    const partesDoDominio = host.split('.');
    const domainSize = ENV.DOMAIN.split('.').length;
    if (partesDoDominio.length > domainSize) {
      return partesDoDominio[0];
    }
  }

  return null;
}