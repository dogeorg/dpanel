[&larr; Back](README.md)

## D. Key management

> Creating a master key, revealing a seedphrase

#### GET kdms/keys

Description: Retrieves a list of keys.
Intended purpose: Used within the setup and dpanel key management experience, the client lists seeks to list master keys.
When a user does not have a master key, they are prompted to create one.  After creating their master key, we show the key list to them.

#### Example request:

```
GET https://api.dogeboxd.server/kdms/keys?type="master"
```

#### Response:

```
{
  "success": true,
  "list": [
    { "type": "master", "created": Date.now() }
  ]
}
```

#### POST kdms/key

Description: Creates a new key.
Intended use: Used to generate a master key, the client expects to then reveal a 12-word seedphrase.

#### Example request:

```
POST https://api.dogeboxd.server/kdms/keys
{
  type: 'master',
  password: String (encoded password)
}
```

*Special note*: Keys expect to be encrypted with the users dogebox password
Therefore, this API requires a password to be submitted to it. 
I suggest we attempt a validity check with the supplied password so that a key
is not mistakenly encrypted with a erroneous password. 

#### Response:

```
{
  "success": true,
  "message": "Key successfully created",
  "phrase": "keen tavern drumkit weekend donut turmoil cucumber pants karate yacht treacle chump"
}
```