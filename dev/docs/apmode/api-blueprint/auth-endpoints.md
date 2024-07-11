[&larr; Back](README.md)

## B. Auth Endpoints (setting password, login)

> First task for a new dogebox is to set an admin password.  This API is also used to reset a forgotten password.

#### POST /auth/reset-password

Description: Changes the user's password or updates seedphrase.

#### Example request (submitting password):

```
POST https://api.dogebox.server/auth/reset-password
{
  password: 'flibble'
}
```

#### Example request (submitting seedphrase):

```
POST https://api.dogebox.server/auth/reset-password
{
  seedphrase: 'crunch frog super mince ...'
}
```

#### Response:

```
{
  "success": true,
  "message": "Password successfully changed",
  "auth-token": "flibble-wibble"
}
```

#### POST /auth/login

Description: Logs in the user, provides client an auth-token.

#### Example request:

```
POST https://api.dogebox.server/auth/login
{
  password: "String (hashed password)"
}
```

#### Response:

```
{
  "success": true,
  "message": "Logged in!",
  "auth-token": "ABC123"
}
```