# dpanel
Dogebox Panel - Web UI for managing a Dogebox Server

### Directories

`/src`

> All source code lives here.  Whatever is contained in here is published. No build steps, compilation or transformation (at this stage), striving for “what you see is what you get”.

`/dev`

> Dev server, configs and tooling to aid in the development process.

### Getting Started

Install dev dependencies and add 3x host file entries.

```
cd dev
npm run setup
```

Start the development server:
```
npm start
```

Navigate to
```
http://dogebox.local:8080
```

### What do I get?

**dPanel running** at [http://dogebox.local:8080](http://dogebox.local:8080), with:
- Hot reloading (auto browser refresh on modify)
- SPA ready (index.html served at all routes)
- Basic CORS configuration
- API mocks (via Ctrl+L)

Two sample 'pups' (apps that dPanel iframes), running at
- [http://basic.pup.dogebox.local:9001](http://basic.pup.dogebox.local:9001)
- [http://spa.pup.dogebox.local:9002](http://spa.pup.dogebox.local:9002)