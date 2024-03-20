export default {
  port: 8080,
  rootDir: '../src',
  appIndex: '../src/index.html',
  open: 'http://dogebox.local:8080',
  watch: true,
  middleware: [
    function corsMiddleware(ctx, next) {
      // Check if the incoming request is for the static dir stuff
      if (ctx.url.includes('/static/')) {
        // Set CORS headers
        ctx.response.set('Access-Control-Allow-Origin', '*');
        ctx.response.set('Access-Control-Allow-Methods', 'OPTIONS');
        ctx.response.set('Access-Control-Allow-Methods', 'GET');
        ctx.response.set('Access-Control-Allow-Headers', 'Content-Type');
      }
      return next();
    }
  ]
};