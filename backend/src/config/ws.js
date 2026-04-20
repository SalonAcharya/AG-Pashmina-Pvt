const WebSocket = require("ws");

let wss = null;

/**
 * Attach a WebSocket server to an existing http.Server.
 * Call this once from index.js after creating the HTTP server.
 */
function init(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (socket) => {
    console.log("[WS] Admin client connected");
    socket.on("close", () => console.log("[WS] Admin client disconnected"));
    // Keep connection alive
    socket.on("error", (err) => console.error("[WS] Error:", err.message));
  });

  console.log("[WS] WebSocket server initialised on the same port");
}

/**
 * Broadcast a JSON event to ALL connected WebSocket clients.
 * Silently ignored if the WS server hasn't been initialised yet.
 */
function broadcast(event) {
  if (!wss) return;
  const payload = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

module.exports = { init, broadcast };
