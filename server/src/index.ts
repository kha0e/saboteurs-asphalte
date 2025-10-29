import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { Server as ColyseusServer } from 'colyseus';
import { RaceRoom } from './rooms/RaceRoom';

const port = Number(process.env.PORT || 2567);

// Création de l’application HTTP Express
const app = express();
app.use(cors());
app.get('/health', (_, res) => res.send('OK'));

const httpServer = http.createServer(app);

// Colyseus avec WebSocket
const colyseusServer = new ColyseusServer({
  transport: new WebSocketTransport({ server: httpServer }),
});

// Enregistrement des salles
colyseusServer.define('race', RaceRoom);

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
