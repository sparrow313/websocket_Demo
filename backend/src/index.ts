import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";

const app = express();
const httpServer = app.listen(8080);

const wss = new WebSocketServer({ server: httpServer });

const connectedClients: { ws: WebSocket; room: string }[] = [];

wss.on("connection", function connection(ws, req) {
  ws.on("error", console.error);

  // Parse the room from the query parameter in the URL
  const query = url.parse(req.url || "", true).query;

  console.log(query);
  const room = query.room || "default"; // Default to "default" room if none provided

  connectedClients.push({ ws, room: String(room) });

  ws.on("message", function message(data, isBinary) {
    connectedClients.forEach(function each(client) {
      // Send the message only to clients in the same room
      if (client.room === room) {
        client.ws.send(data, { binary: isBinary });
      }
    });
  });

  ws.send(`Hello! You've joined room: ${room}`);
});

// import express from "express";
// import { WebSocketServer, WebSocket } from "ws";

// const app = express();
// const httpServer = app.listen(8080);

// const wss = new WebSocketServer({ server: httpServer });

// const connectedClients: { ws: WebSocket; room: string }[] = [];

// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);
//   connectedClients.push({ ws, room: "room1" });

//   ws.on("message", function message(data, isBinary) {
//     connectedClients.forEach(function each(client) {
//       if (client.room === "room1") {
//         client.ws.send(data, { binary: isBinary });
//       }
//     });
//   });

//   ws.send("Hello! Message From Server!!");
// });
