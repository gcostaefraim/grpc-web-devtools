// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

// Inject script for grpc-web interceptor
const injectGRPCWebScript = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("grpc-web-interceptor.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
};

// Inject script for connect-web
const injectConnectWebScript = () => {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("connect-web-interceptor.js");
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);
};

// Inject both scripts
injectGRPCWebScript();
injectConnectWebScript();

var port;

function setupPortIfNeeded() {
  if (!port && chrome && chrome.runtime) {
    port = chrome.runtime.connect(null, { name: "content" });
    port.postMessage({ action: "init" });
    port.onDisconnect.addListener(() => {
      port = null;
      window.removeEventListener("message", handleMessageEvent, false);
    });
  }
}

function sendGRPCNetworkCall(data) {
  setupPortIfNeeded();
  if (port) {
    port.postMessage({
      action: "gRPCNetworkCall",
      target: "panel",
      data,
    });
  }
}

function handleMessageEvent(event) {
  if (event.source != window) return;
  if (event.data.type && event.data.type == "__GRPCWEB_DEVTOOLS__") {
    sendGRPCNetworkCall(event.data);
  }
}

window.addEventListener("message", handleMessageEvent, false);
