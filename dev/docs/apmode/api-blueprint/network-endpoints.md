[&larr; Back](README.md)

## C. Network configuring endpoints

> Listing available networks, setting desired network.

#### GET /networks

Description: Lists all available networks.
Intended use: Fetched within both the onboarding network selection experience and dpanel network settings.

#### Example request:

```
GET https://api.dogebox.server/networks
```

#### Response:

```
{
  "success": true,
  "networks": [
    { "type": "ethernet", "id": "ethernet", "label": "Ethernet" },
    { "type": "wifi", "id": "home-wifi", "label": "Home Wifi" }
  ]
}
```

*Special note:*
Where a user has elected and configured a network this should
be indicated within the payload (see below):


#### Response:
```
{
  "success": true,
  "networks": [
    { "id": "ethernet", "type": "ethernet", "label": "Ethernet" },
    { "id": "home-wifi", "type": "wifi", "label": "Home Wifi", active: true, passphrase: "flibble" }
  ]
}
```

#### POST /network

Description: Stores details of desired network and attempts connection.
Intended use: Within initial setup where the user picks a network from a predefined list, submitting any required credentials.  
The experience is expecting to know whether the connection is successful or not.

#### Example request:
```
POST https://api.dogebox.server/network/connect
{ 
  id: String,
  passphrase: String
}
```

#### Response (Success):
```
  {
    "success": true,
    "message": "Network successfully set"
  }
```

#### Response (Error)
``` 
  {
    "error": true,
    "message": "Check credentials"
  }
```