import express from 'express';
import cors from 'cors';
import { Server } from 'colyseus';
import { createServer } from 'http';
import { RaceRoom } from './rooms/RaceRoom';

// Render will provide process.env.PORT (usually 10000). Fallback to 2567 for local development.
const port = Number(process.env.PORT) || 2567;

// Create Express app for HTTP endpoints (e.g., health check). This server will
// handle any REST endpoints (e.g., health check) and will also be passed to
// Colyseus so that the WebSocket server and HTTP server run on the same port.
const app = express();
app.use(cors());
app.get('/health', (_, res) => res.send('OK'));

// Create native Node.js HTTP server from the Express app.
const httpServer = createServer(app);

// Instantiate Colyseus server and attach it to the existing HTTP server. Without
// specifying a transport explicitly, Colyseus will use its default WebSocket
// transport. Passing the HTTP server allows both HTTP and WS traffic to share
// the same port.
const gameServer = new Server({ server: httpServer });

// Register rooms
gameServer.define('race', RaceRoom);

// Listen on provided port
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});