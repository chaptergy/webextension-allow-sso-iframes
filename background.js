// Change outgoing headers
try {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    changeRequestHeaders, {
      urls: ['<all_urls>']
    }, ['blocking', 'requestHeaders', 'extraHeaders']
  );
} catch(e) {
  // On firefox 'extraHeaders' is included in 'requestHeaders' and can't be set explicitly
  chrome.webRequest.onBeforeSendHeaders.addListener(
    changeRequestHeaders, {
      urls: ['<all_urls>']
    }, ['blocking', 'requestHeaders']
  );
}

// Change incoming headers
try {
  chrome.webRequest.onHeadersReceived.addListener(
    changeResponseHeaders, {
      urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders", "extraHeaders"]
  );
} catch(e) {
  // On firefox 'extraHeaders' is included in 'requestHeaders' and can't be set explicitly
  chrome.webRequest.onHeadersReceived.addListener(
    changeResponseHeaders, {
      urls: ["<all_urls>"]
    }, ["blocking", "responseHeaders"]
  );
}

function changeResponseHeaders(details){
  if(details.responseHeaders.length > 0){
    for (var i = details.responseHeaders.length - 1; i >= 0; --i) {
      var header = details.responseHeaders[i];
      console.log("Header", i, header.name);
      if (header.name.toLowerCase() === 'x-frame-options' || header.name.toLowerCase() === 'content-security-policy') {
        // Remove x-frame-options and content-security-policy
        details.responseHeaders.splice(i, 1);
      } else if (header.name.toLowerCase() === 'set-cookie') {
        // Change cookies to be SameSite=None
        if(header.value.match(/;\s*[Ss]ame[Ss]ite=/)){
          header = header.value.replace(/;\s*[Ss]ame[Ss]ite=[^;]*/, '; SameSite=None');
        } else {
          header.value += '; SameSite=None';
        }
        // Set secure flag if not there (Required for SameSite)
        if(!header.value.match(/;\s*[Ss]ecure/)){
          header.value += '; Secure';
        }
      }
    }
    return { responseHeaders: details.responseHeaders };
  }
}

function changeRequestHeaders(details){
  for (var i = 0; i < details.requestHeaders.length; ++i) {
    if (details.requestHeaders[i].name.toLowerCase() === 'sec-fetch-dest' && details.requestHeaders[i].value.toLowerCase() === 'iframe') {
      details.requestHeaders[i].value = 'document';
      break;
    }
  }
  return { requestHeaders: details.requestHeaders };
}