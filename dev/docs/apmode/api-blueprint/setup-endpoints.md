[&larr; Back](README.md)

## A. Bootstrap endpoints

>  Helps the client to determine where the user is up to with the setup process.

#### GET /setup

Description: Retrieves the setup status of the system.
Intended use: The client retrieves the setup status of the system to know what setup steps the user has performed and thereby, present an appropriate next step.

#### Example request:

```
GET https://api.dogebox.server/setup/status
```

#### Response:

```
{
  "success": true,
  "facts": {
    "hasPassword": false,
    "hasKey": false,
    "hasConnection": false
  }
}
```

### GET /reflector/ip

Description: Retrieves the IP address of the reflector.

#### Example request:

```
GET https://reflector.dogebox.net/ip
```

#### Response

```
{
  "success": true,
  "ip": "192.168.0.57",
  "lastSeen": Date.now()
}
```