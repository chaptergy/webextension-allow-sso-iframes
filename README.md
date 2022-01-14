# Allow SSO iFrames

This plugin changes HTTP headers to allow websites to be iframed which block this. It is meant for development and testing purposes.

It does the following:

- Drop all `x-frame-options` response headers
- Drop all `content-security-policy` response headers
- Change all `set-cookie` response headers to set `SameSite=None` (this also requires the `Secure` flag to be set for the cookie)
- Change `sec-fetch-dest` request headers to `document` if it equals `iframe`

Note, that when cookies within this iframe are required, the iframe content has to be HTTPS, otherwise cookies will not be set.

## Download from Stores

The Add-On is available on the [Firefox Add-On Store](https://addons.mozilla.org/en-US/firefox/addon/allow-sso-iframes/).  
I have not published it on the chrome web store, since they charge a fee to do so.
