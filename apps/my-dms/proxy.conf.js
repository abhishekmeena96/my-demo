console.log('Proxy config loaded - target: http://10.20.20.96:8080');

module.exports = {
  '/alfresco': {
    target: 'http://10.20.20.96:8080',
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', 'http://10.20.20.96:8080');
      }
    }
  }
};